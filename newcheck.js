var http = require('http');
var express = require('express');
var router = express.Router();
var util = require("util");
var apiai = require("apiai");

var app = apiai("c743619629b2490fab9751dac552094a");
var speech = 'check speech';

var options = {
    sessionId: '<UNIQE SESSION ID>'
}

var request = app.textRequest();

request.on('response', function(response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    // Note: the 2 lines above could be replaced with this next one:
    // response.writeHead(200, {'Content-Type': 'application/json'})

    var responseBody = {
        "speech": speech,
        "displayText": speech,
        "source": "apiai-weather-webhook-sample"
    };

    response.write(JSON.stringify(responseBody));
    response.end();
	console.log(response);
});
	
request.on('error', function(error) {
    console.log(error);
});

request.end();

//}).listen((process.env.PORT), () => console.log("Server listening"));

//}).listen(process.env.PORT);

var server = http.createServer((request, response) => response.send(response));

//Lets start our server
server.listen((process.env.PORT), () => console.log("Server listening")); 
var server = http.createServer((request, response) => response.send(response));

