/*!
 * apiai
 * Copyright(c) 2015 http://api.ai/
 * Apache 2.0 Licensed
 */

//var apiai = require("../module/apiai");
var apiai = require("apiai");
const http = require('http');

var app = apiai("c743619629b2490fab9751dac552094a");
    
var options = {
    sessionId: '<UNIQE SESSION ID>'
}

var request = app.textRequest('Hello', options);

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();

const server = http.createServer((request, response) => response.end());

//Lets start our server
server.listen((process.env.PORT), () => console.log("Server listening"));
