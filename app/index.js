/*
 * Primary file for the API
 *
 */

 // Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// The server should respond to all requests with a srting
const server = http.createServer(function (req, res) {
    
    // Get the parsed url
    const parsedURL = url.parse(req.url, true);

    // Get the path
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    const queryStringObject = { ...parsedURL.query };

    // Get the HTTP Method
    const method = req.method.toLowerCase();

    // Get Headers
    const headers = { ...req.headers };

    // Get the payload if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });

    req.on('end', function () {
        buffer += decoder.end();

        // Choose the handler this request should go to
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // construct the data object to be sent to the handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, function (statusCode, payload) {
            // use the status code called back by the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // use the payload specified by the handler or default to an empty object
            payload = typeof (payload) == 'object' ? payload : {};
            
            // Convert the payload to a string
            const payloadString = JSON.stringify(payload)

            // Return the response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadString)

            // Log the request path
            console.log('Returning this response: ', statusCode, payloadString);
        });
    });
     
});

// Start the server
server.listen(config.port, function () {
    console.log(`The server is listening on port ${config.port} in ${config.envName} mode`);
});


// Define the handlers
let handlers = {}

// Sample Handler
handlers.sample = function (data, callback) {
    // Callback a http status code, and a payload object
    callback(406, { 'name': 'sample handler' });
};

// Not found Handler
handlers.notFound = function (data, callback) {
    callback(404);
}

// Define a request router
const router = {
    'sample' : handlers.sample
}