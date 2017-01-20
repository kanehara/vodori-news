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
let host = "https://api.hipchat.com";

/**
 * Hipchat API parameters
 */
let authToken = "uaL27J06UjdzHaQHVvijzGqs2ZYLMBMoAjq6KmyV";   // Expires January 19th, 2018
let roomNumber = "3502399";

/**
 * Message history url paramters
 */
let messagePath = "/v2/room/" + roomNumber + "/history";
let maxResults = 1000;
let reverse = false;
let queryParameters = "?reverse=" + reverse + "&max-results=" + maxResults + "&auth_token=" + authToken;
let messagesUrl = host + messagePath + queryParameters;
let messageUrl = host + messagePath;

/**
 * Create our server object
 */
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: port
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
 * @returns {Promise.<*>} - promise containing an array of link objects
 */
let extractLinkyLinks = function(messages) {
    let linkObjectPromises = [];

    for(let i = 0; i < messages.length; i++) {
        // If our message is a linky link
        if(messages[i].hasOwnProperty('card')) {
            // Extract the message id that the linky link belongs to
            let messageId = messages[i]['attach_to'];
            // Create api url to get original message details from the linky link
            let fullMessageUrl = messageUrl + '/' + messageId + '?auth_token=' + authToken

            // Push our link object to our array of links
            linkObjectPromises.push(createLinkObject(messages[i], fullMessageUrl));
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
            link['url'] = linkyLinkDetails['url'];
            link['description'] = linkyLinkDetails['description'];
            link['title'] = linkyLinkDetails['title'];
            link['image'] = linkyLinkDetails['thumbnail']['url'];
            link['from']['name'] = data['message']['from']['name'];
            link['from']['mention_name'] = data['message']['from']['mention_name'];

            resolve(link);
        }).catch(error => {
            console.error(error);
            reject(error);
        });
    });
};

/* ---------------- */
/* Server functions */
/* ---------------- */

/**
 * Message link history route at root.
 */
server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {

        return reply(httpGet(messagesUrl).then(data => {
            return extractLinkyLinks(data.items);
        }));
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
