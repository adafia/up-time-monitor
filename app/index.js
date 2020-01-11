/*
 * Primary file for the API
 *
 */

 // Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

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
    const method = req.method.toUpperCase();

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

        // Send the response
        res.end('Hello from the server\n');

        // Log the request path
        console.log('payload: ', buffer);
    });
     
});

// Start the server and have it listen on port 3000
server.listen(3000, function () {
    console.log('The server is listening on port 3000 now');
});
