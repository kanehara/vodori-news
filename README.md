# VodoriNews

## Overview

VodoriNews is a Single Page Application (SPA) utilizing a [Vue.js](https://vuejs.org/) front-end framework
to call a [Hapi](https://hapijs.com/) server. The Hapi server requests information from [HipChat's API](https://www.hipchat.com/docs/apiv2) to 
build a list of messages with links from a variety of Vodori's most popular public rooms.

## Front End Setup

To install VodoriNews, make sure you are running [node.js](https://nodejs.org/en/) 6.x and above.
1. From the `/front-end` directory, run `npm install`
2. Then start the server using any of the following commands
    ```
    # install dependencies
    npm install
    
    # serve in dev mode, with hot reload at localhost:8080
    npm run dev
    
    # build for production
    npm run build
    
    # serve in production mode
    npm start
    ```

## API Setup

### Node Installation
1. Run `nvm install` (node version should change)
2. Run `npm install` (node modules directory created and dependencies installed)
3. Run `npm start` (hapi server should start on localhost:3000)
4. Navigate to `localhost:3000`, an array of link data should be returned
5. Note: All data is cached per roomId for 5 minutes

### Get a new API key
1. Navigate to 'https://vodori.hipchat.com/account/api'
2. Go to the `Create new token` section and generate a token for the `View Messages` scope
3. Paste your new token in `./api/server.js` near the top for `authToken`
4. You should now be authenticated. The token will expire in 1 year and is rate limited at 500 API calls per 5 minutes

### Find Hipchat room number
1. Navigate to 'https://vodori.hipchat.com/rooms'
2. Search for the desired room and click into it
3. Extract the seven digit number from the end of the URL, this is the Hipchat room ID
4. You can set the `defaultRoomNumber` in `./api/server.js`, or use the id when calling the API directly

### Using the API
1. Server currently runs on `localhost`, so that should be prepended to the paths below
    ```
    Method: 'GET',
    Path:'/',
    Response: array of link objects for the default room (defined in server.js)
    ```
    
    ```
    Method: 'GET',
    Path:'/room/{roomId}',
    Response: array of link objects for the specified room
    ```
    
    ```
    Method: 'GET',
    Path:'/clearCache',
    Response: status indicating that the cache successfully cleared
    ```
      
