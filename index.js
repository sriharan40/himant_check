var express = require('express');
var router = express();
var http = require('http');
var util = require("util");
var apiai = require("apiai");
const uuid = require('node-uuid');
var request = require("request");

var app = apiai("c743619629b2490fab9751dac552094a");

var options = {
    sessionId: Math.floor(1000000 + Math.random() * 9000000)
}

http.createServer(function(req, response) {
  var headers = req.headers;
  var method = req.method;
  var url = req.url;
  var body = [];
		
  req.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk) {
	body += chunk;	  
        
	   //console.log(body.customerName);
  }).on('end', function() {
    //body = Buffer.concat(body).toString();

// PARSE THE BODY DATA AND THEN TAKE ACTIONS.

var speech = 'Welcome to the Bot Chat';	

response.statusCode = 200;
	
response.setHeader('Content-Type', 'application/json');	

// GENERATE THE RESPONSE BODY - HIMANT - And SEND BACK THE RESPONSE TO CLIENT SPEECH Object
     var responseBody = {
        "speech": speech,
        "displayText": speech,	     
        "source": "apiai-Himant-OTP sample"
    };
	
try {
      var data = JSON.parse(body);	
	  var action = data.result.action;
    } catch(e) {
        console.log('malformed request', body);
        //  return response.status(400).send('malformed request: ' + body);
    }
	  
    response.on('error', function(err) {
      console.error(err);
    });

	  
// TWILIO SMS
if(action == "sendOTP")
{
	var otp = Math.floor(1000 + Math.random() * 9000);
	console.log(otp);
	var name = data.result.parameters.customerName;
	var mobile = '+63'+data.result.parameters.phone;
	var speech = name + ', We will send you an OTP on your number ' + mobile +'. Please reply back here with that OTP.';

	var value = name + mobile;

	var req = app.textRequest(value, options);
	
	// Load the twilio module

	// Twilio Credentials 
	var accountSid = 'ACe0b6cfbf60f11584099ee062db873252'; 

	var authToken = '7468f40b17004327190847d04b4222ba'; 

	var client = require('twilio')(accountSid, authToken);

	// SET THE OTP in RESPONSE FULFILMENT - Himant

	//1. set in context out in response object  for context validateOTP the parameter "number" = otp
	//2. in validateOTP in next call, you will get the number and the input OTP. Compare both and return success or failure.
	
	// SET oF OTP in response Himant - ends
	
	// Create a new REST API client to make authenticated requests against the
	// twilio back end
	//var client = new twilio.RestClient('ACe0b6cfbf60f11584099ee062db873252', '7468f40b17004327190847d04b4222ba');

	// Pass in parameters to the REST API using an object literal notation. The
	// REST client will handle authentication and response serialzation for you.
	client.sms.messages.create({
	    to: mobile,
	    from: '+18312165009',
	    body: 'Your one time password for verficiation is :' + otp
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

	   // GENERATE THE RESPONSE BODY - HIMANT - And SEND BACK THE RESPONSE TO CLIENT SPEECH Object
     var responseBody = {
        "speech": speech,
        "displayText": speech,
	"contextOut": [{"name":"otp_check", "lifespan":1, "parameters":{"number":otp}}],
        "source": "apiai-Himant-OTP sample"
	};

}

if(action == "validateOTP")
{
	var otp1 = data.result.parameters.inputOTP;

	var otp_check1 = data.result.contexts[1].parameters.number;	

	if(otp1 == otp_check1)
	{
	var speech = 'Thanks for confirmation.May I know your concerns now? Let us resolve one by one.)';
	}
	else{
	var speech = 'Oops. I am sorry, the OTP is wrong.';	
	}

    response.statusCode = 200;
	
    response.setHeader('Content-Type', 'application/json');	

	// GENERATE THE RESPONSE BODY - HIMANT - And SEND BACK THE RESPONSE TO CLIENT SPEECH Object
     var responseBody = {
        "speech": speech,
        "displayText": speech,
	"contextOut": [{"name":"otp_check", "lifespan":1, "parameters":{"number":otp_check1}}],	     
        "source": "apiai-Himant-OTP sample"
    };
	
}

if(action == "getOutstandingBalance")
{
    response.statusCode = 200;
	
    response.setHeader('Content-Type', 'application/json');	

	var speech = 'Your due amount to be paid is 1000 Php.';	

	var token = "EAAEcEkKVmnIBAChlOhWc1tHveQIHOuutAOQQGAQqL7QbwPXBO5zC0pOG39JmHsOl81UZA6W3C4wZAZBf9z4l88RKEacF7zg65NWyGoBr4b6vmLoTLQuUXlBSI21IohuSU4G0AyJ12F5037LBNndmXotz9xZAq2p3GVZBcNmyIcgZDZD";

	var sender = data.result.contexts[0].parameters.user_id;
	var checkSenderID = uuid.v1();
	console.log('Sender ID check' + checkSenderID);
	console.log(checkSenderID);
	//
	sender =checkSenderID;
	//
	if(sender == undefined || sender == "")
	{
	var sender = '+63'+data.result.contexts[0].parameters.phone;
	}
	
facebook_message = 

  messageData = {
	"attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Your due amount to be paid is 1000 Php.",
        "buttons":[
          {
            "type":"web_url",
            "url":"https://paypal.com",
            "title":"Pay with PayPal"
          }
	  ]

	 }	
   }	  
}
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
        //recipient: {phone_number:sender},
        recipient: {id:sender},
        message: messageData,
      }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
	  }  
	  });
	  
	// GENERATE THE RESPONSE BODY - HIMANT - And SEND BACK THE RESPONSE TO CLIENT SPEECH Object
    if(sender != undefined)
	{
	var responseBody = {
        "speech": speech,
        "displayText": speech,
		"data": {"facebook": {facebook_message}},
        "source": "apiai-Himant-OTP sample"
    };
	}
}
    response.write(JSON.stringify(responseBody));
    response.end();
  });
}).listen((process.env.PORT || 5000), () => console.log("Server listening"));
