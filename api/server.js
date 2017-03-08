'use strict';

/* ---------------- */
/* Define Variables */
/* ---------------- */

/**
 * Imports
 */
const Hapi = require('hapi');
const axios = require('axios');

/**
 * Hapi parameters
 */
let port = 3000;
let host = 'https://api.hipchat.com';

/**
 * Hipchat API parameters
 */
let authToken = 'auth-token-placeholder';

let defaultRoomNumber = '3502399';     // Test Room
// let defaultRoomNumber = '1839723';     // All the People Room

/**
 * Message history url parameters
 */
let maxResults = 100;
let reverse = false;
let messagesQueryParameters = '?reverse=' + reverse + '&max-results=' + maxResults + '&auth_token=' + authToken;

/**
 * Cache parameters
 */
let cacheTimeToLive = 5;
let cachedData = {
    time: 0
};

/**
 * Create our server object
 */
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: port,
    routes: {
        cors: true
    }
});

/* ---------------- */
/* Helper functions */
/* ---------------- */

/**
 * Standard get request.
 *
 * @param url - url to perform get request on
 * @returns {Promise} - promise containing get response body
 */
let httpGet = function(url) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(function(response){
                resolve(response.data);
            })
            .catch(function(error) {
                console.log(error);
                reject(error);
            });
    })
};

/**
 * Create an array of link objects from an array of message objects.
 *
 * @param messages - array of message objects
 * @param messageBaseApiUrl - api message url for the current room
 * @returns {Promise.<*>} - promise containing an array of link objects
 */
let extractLinkyLinks = function(messages, messageBaseApiUrl) {
    let linkObjectPromises = [];

    for(let i = 0; i < messages.length; i++) {
        // If our message is a linky link
        if(messages[i].hasOwnProperty('card')) {
            // Extract the message id that the linky link belongs to
            let messageId = messages[i]['attach_to'];
            // Create api url to get original message details from the linky link
            let messageFullApiUrl = messageBaseApiUrl + '/' + messageId + '?auth_token=' + authToken;

            // Push our link object to our array of links
            linkObjectPromises.push(createLinkObject(messages[i], messageFullApiUrl));
        }
    }

    return Promise.all(linkObjectPromises);
};

/**
 * Create a link object from a message object.
 *
 * @param message - message to create the link object from
 * @param messageUrl - url of api to get the related non-linky message
 * @returns {Promise} - promise containing a link object
 */
let createLinkObject = function(message, messageUrl) {
    return new Promise((resolve, reject) => {
        httpGet(messageUrl).then(data => {
            // Parse linky link details into a json object
            let linkyLinkDetails = JSON.parse(message['card']);
            let link = {};
            link['from'] = {};

            // Extract linky link details
            try {
                link['url'] = linkyLinkDetails.url;
                link['description'] = linkyLinkDetails['description'];
                link['title'] = linkyLinkDetails['title'];

                // If there is no thumbnail image, set it to null
                try {
                    link['imageUrl'] = linkyLinkDetails['thumbnail']['url'];
                } catch (error) {
                    link['imageUrl'] = '';
                }

                link['timestamp'] = data['message']['date'];
                link['from']['name'] = data['message']['from']['name'];
                link['from']['mention_name'] = data['message']['from']['mention_name'];
            } catch (error) {
                console.error(error);
                console.log("for linkyLink: " + linkyLinkDetails.stringify());
            }

            resolve(link);
        }).catch(error => {
            console.error(error);
            reject(error);
        });
    });
};

/**
 * Get our link data. If it exists in cache and the cache should still be alive (<5 mins from when it was added
 * to the cache), return the cached data. Otherwise, get new data and cache it.
 *
 * @param data - messages to extract links from
 * @param messageBaseApiUrl - base api url to get info on a specific message for the current data
 * @returns {*} - either a cached object or new object holding our links for the specified data
 */
let cacheData = function(data, messageBaseApiUrl) {
    if(cachedData[messageBaseApiUrl]) {
        // Get cache timestamp and current time stamp
        let cacheTime = cachedData[messageBaseApiUrl]['time'];
        let currentTime = new Date();

        // Get difference between time in minutes
        let diffMs = (currentTime - cacheTime);
        let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

        // If the time difference is less than the cache time to live, return cached data
        if (diffMins < cacheTimeToLive) {
            return cachedData[messageBaseApiUrl]['links'];
        }
    } else {
        cachedData[messageBaseApiUrl] = {};
    }

    // Otherwise, get new data, cache it, and return it
    cachedData[messageBaseApiUrl]['links'] = extractLinkyLinks(data, messageBaseApiUrl);
    cachedData[messageBaseApiUrl]['time'] = new Date();
    return cachedData[messageBaseApiUrl]['links'];
};

/**
 * Create a messages api url for the room id passed in.
 *
 * @param roomId - roomId to create the message api url for
 * @returns {string} - messages api url for the given roomId
 */
let createMessagesApiUrl = function(roomId) {
    let isoDate = new Date().toISOString();

    let messageBaseUrl = host + '/v2/room/' + roomId + '/history';
    return messageBaseUrl + messagesQueryParameters + '&date=' + isoDate;
};

/* ---------------- */
/* Server functions */
/* ---------------- */

/**
 * Message link history route for the default room.
 */
server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {

        // Create our api url to get details on a specific message in the current room
        let messageBaseApiUrl = host + '/v2/room/' + defaultRoomNumber + '/history';

        return reply(httpGet(createMessagesApiUrl(defaultRoomNumber)).then(data => {
            return cacheData(data.items, messageBaseApiUrl);
        }).catch((err) => {
            console.log(err);
        }));
    }
});

/**
 * Message link history route for a specific room number.
 */
server.route({
    method: 'GET',
    path:'/room/{roomId}',
    handler: function (request, reply) {

        // Create our api url to get details on a specific message in the current room
        let messageBaseApiUrl = host + '/v2/room/' + request.params.roomId + '/history';

        return reply(httpGet(createMessagesApiUrl(request.params.roomId)).then(data => {
            return cacheData(data.items, messageBaseApiUrl);
        }).catch((err) => {
            console.log(err)
        }));
    }
});

server.route({
    method: 'GET',
    path:'/clearCache',
    handler: function (request, reply) {

        cachedData = {};
        return reply("Cache cleared.");
    }
});

/**
 * Start our server.
 */
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
