var http = require('http');
var express = require('express');
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
	 //  var textReq = app.textRequest();
	//   console.log (textReq['ClientRequest']);
	   body += chunk;	  
      // body.push(chunk);
	   
	   //console.log(body.customerName);
  }).on('end', function() {
    //body = Buffer.concat(body).toString();

try {
      var data = JSON.parse(body);
//	console.log(data);	
    } catch(e) {
        console.log('malformed request', body);
        //  return response.status(400).send('malformed request: ' + body);
    }
	  
    response.on('error', function(err) {
      console.error(err);
    });

//var name = request.param('customerName');

//var mobile = request.param('phone-number');

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */

 
//router.use(bodyParser.json());

//router.use(bodyParser.urlencoded({
//    extended: true
//}));

//router.post("/", function (req, res) {
//    console.log(req.result.parameters.phone-number)
//});

//console.log(body);

var data = JSON.parse(body);

var action = data.result.action;
if(action == "sendOTP")
{
var otp = Math.floor(1000 + Math.random() * 9000);
var name = data.result.parameters.customerName;
var mobile = data.result.parameters.phone;
	  
var speech = name + ', We will send you an OTP now. Please check your mobile';

var value = name + mobile;

var request = app.textRequest(value, options);

// Load the twilio module

// Twilio Credentials 
var accountSid = 'ACe0b6cfbf60f11584099ee062db873252'; 

var authToken = '7468f40b17004327190847d04b4222ba'; 

var client = require('twilio')(accountSid, authToken);

// Create a new REST API client to make authenticated requests against the
// twilio back end
//var client = new twilio.RestClient('ACe0b6cfbf60f11584099ee062db873252', '7468f40b17004327190847d04b4222ba');

// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.
client.sms.messages.create({
    to: '+63'mobile,
    from: '+18312165009',
    body: 'One time password for verification is' + otp
}, function(error, message) {
    // The HTTP request to Twilio will run asynchronously. This callback
    // function will be called when a response is received from Twilio
    // The "error" variable will contain error information, if any.
    // If the request was successful, this value will be "falsy"
    if (!error) {
        // The second argument to the callback will contain the information
        // sent back by Twilio for the request. In this case, it is the
        // information about the text messsage you just sent:
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
 
        console.log('Message sent on:');
        console.log(message.dateCreated);
    } else {
        console.log('Oops! There was an error.');
    }
});
    
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
	   
}
	  
     var responseBody = {
        "speech": speech,
        "displayText": speech,
        "source": "apiai-Himant-OTP sample"
    };
	  
    response.write(JSON.stringify(responseBody));
    response.end();
  });
}).listen((process.env.PORT), () => console.log("Server listening"));
