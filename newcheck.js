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


http.createServer(function(request, response) {
  var resultp = app.textRequest();
    console.log('resp is' + resultp);
  request.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk) {
    //body.push(chunk);
  }).on('end', function() {
    //body = Buffer.concat(body).toString();
    // BEGINNING OF NEW STUFF

    response.on('error', function(err) {
      console.error(err);
    });

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
     // Note: the 2 lines above could be replaced with this next one:
    // response.end(JSON.stringify(responseBody))

    // END OF NEW STUFF
  });
}).listen((process.env.PORT), () => console.log("Server listening"));
