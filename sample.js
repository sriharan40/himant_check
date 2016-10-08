var http = require('http');
var express = require('express');
//var router = express.Router();
var router = express();
var util = require("util");
var apiai = require("apiai");

var app = apiai("c743619629b2490fab9751dac552094a");

var options = {
    sessionId: '<UNIQE SESSION ID>'
}

http.createServer(function(request, response) {
  var headers = request.headers;
  var method = request.method;
  var url = request.url;
  var body = [];
		
  request.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk) {
	   //var textReq = app.textRequest();
	   //console.log (textReq['ClientRequest']);
	   body += chunk;
       body.push(chunk);
	   //console.log(body.customerName);
  }).on('end', function() {
    //body = Buffer.concat(body).toString();
  
    response.on('error', function(err) {
      console.error(err);
    });

var req = JSON.parse(body);

var otp = Math.floor(1000 + Math.random() * 9000);

var name = req.get("result").get("parameters").get("customerName");

var mobile = req.get("result").get("parameters").get("phone");

var speech = name + ', We will send you an OTP now. Please check your mobile';

var value = name + mobile;

var request = app.textRequest(value, options);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
	   
     var responseBody = {
        "speech": speech,
        "displayText": speech,
        "source": "apiai-Himant-OTP sample"
    };
	  
    response.write(JSON.stringify(responseBody));
    response.end();

  });
}).listen((process.env.PORT), () => console.log("Server listening"));	