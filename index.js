var express = require('express');
var router = express();
//require('node-import');
var mysql = require('mysql');
var request = require("request");
var util = require("util");
var http = require('http');
var apiai = require("apiai");
var dashbot = require('dashbot')(process.env.DASHBOT_API_KEY).facebook;

var app = apiai(process.env.APIAI_ACCESS_TOKEN);
	
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
	console.log("Body: "+body);
        dashbot.logIncoming(req.body);
	   //console.log(body.customerName);
  }).on('end', function() {
    //body = Buffer.concat(body).toString();
	
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
	
	console.log("Action: "+action);

if(action == "showOfferOptionsToUser")
{
var token = process.env.FB_PAGE_TOKEN;

var sender = data.result.contexts[0].parameters.user_id;

console.log("Sender:"+sender);
	
facebook_message = 
  messageData = {
/*    "text":"Select an offer:",
	"quick_replies":[
		{
			"content_type":"text",
        "title":"Facebook 1 hr",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
      },
		{
			"content_type":"text",
        "title":"Youtube 1 day",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
      }
    ] */
"attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Select an offer:",
        "buttons":[
          {
            "type":"web_url",
            "url":"https://bit.ly/2f9GemL",
            "title":"Facebook 1 hr"
          },
          {
           "type":"web_url",
            "url":"https://bit.ly/2dZcUN5",
            "title":"Youtube 1 day"
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
        recipient: {id:sender},
        message: messageData,
      }
  }, function(error, res, body) {
	   dashbot.logOutgoing(data, res.body);
    if (error) {
      console.log('Error sending message: ', error);
		  var speech = error;
    } else if (res.body.error) {
      console.log('Error: ', res.body.error);
      var speech = res.body.error;
	  }
	  else{
		var speech = 'Welcome to the ePayment System.';			
	  }
    
	  });

response.statusCode = 200;

response.setHeader('Content-Type', 'application/json');
	  
	// GENERATE THE RESPONSE BODY - HIMANT - And SEND BACK THE RESPONSE TO CLIENT SPEECH Object
if(sender != undefined || sender != "")
{
	var responseBody = {
        "speech": speech,
        "displayText": speech,	 
		"data": {"facebook": {facebook_message}},		
        "source": "apiai-Himant-OTP sample"
    };	  
} 

else{
	var speech = 'Welcome to the ePayment System. Say Hello!';	

	var responseBody = {
        "speech": speech,
        "displayText": speech,	 
        "source": "apiai-Himant-OTP sample"
    };		
}
//'@import offers.js';
//var offers = require("offers.js");		
}	

if(action == "SelectedOffer")
{
var open = require("open");

var offer1 = data.result.parameters.offername;

console.log("Offer:"+offer1);

if(offer1 == "Facebook 1 hr")
{
console.log("Opening facebook offer");
var opener = require("opener");
opener("https://bit.ly/2f9GemL");	
}	

if(offer1 == "Youtube 1 day")
{
console.log("Opening youtube offer");
var opener = require("opener");
opener("https://bit.ly/2dZcUN5");	
}

	var speech = 'Thanks for the selection.';

	var responseBody = {
        "speech": speech,
        "displayText": speech,	 
        "source": "apiai-Himant-OTP sample"
    };
	
}	

if(action == "showOptionsToUser")
{
	var token = process.env.FB_PAGE_TOKEN;

	var sender = data.result.contexts[0].parameters.user_id;

console.log("Sender:"+sender);
	
facebook_message = 
	
  messageData = {
    "text":"Select an option:",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Billed Amount",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
      },
      {
        "content_type":"text",
        "title":"My Plan",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
      }
    ]
   }
   request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: messageData,
      }
  }, function(error, res, body) {
	   dashbot.logOutgoing(data, res.body);
    if (error) {
      console.log('Error sending message: ', error);
		  var speech = error;
    } else if (res.body.error) {
      console.log('Error: ', res.body.error);
      var speech = res.body.error;
	  }
	  else{
		var speech = 'Welcome to the ePayment System.';			
	  }
    
	  });

	      response.statusCode = 200;
	
		  response.setHeader('Content-Type', 'application/json');
	  
	// GENERATE THE RESPONSE BODY - HIMANT - And SEND BACK THE RESPONSE TO CLIENT SPEECH Object
if(sender != undefined || sender != "")
{
	var responseBody = {
        "speech": speech,
        "displayText": speech,	 
		"data": {"facebook": {facebook_message}},		
        "source": "apiai-Himant-OTP sample"
    };	  
} 

else{
	var speech = 'Welcome to the ePayment System. Say Hello!';	

	var responseBody = {
        "speech": speech,
        "displayText": speech,	 
        "source": "apiai-Himant-OTP sample"
    };		
}
}
 
// TWILIO SMS
if(action == "sendOTP")
{
	var otp = Math.floor(1000 + Math.random() * 9000);
	console.log(otp);
	var name = data.result.parameters.customerName;
	var mobile = '+'+data.result.parameters.phone;
	var speech = name + ', We will send you an OTP on your number ' + mobile +'. Please reply back here with that OTP.';

	var value = name + mobile;

	var req = app.textRequest(value, options);
	
	// Load the twilio module

	// Twilio Credentials 
	var accountSid = process.env.accountSid;
	var authToken = process.env.authToken;

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
	"contextOut": [{"name":"otp_check", "lifespan":3, "parameters":{"number":otp}}],
        "source": "apiai-Himant-OTP sample"
	};

}

if(action == "validateOTP")
{
	var otp1 = data.result.parameters.inputOTP;

	var otp_check1 = data.result.contexts[2].parameters.number;

	var sender = data.result.contexts[0].parameters.user_id;

	if(otp1 == otp_check1)
	{
	//var speech = 'Thanks for confirmation.May I know your concerns now? Let us resolve one by one.)';
	var db_config = {
		host: 'us-cdbr-iron-east-04.cleardb.net',
		user: 'b213965cc9ad75',
		password: '9c81ac99',
		database: 'heroku_a0067bd7c868fc0'
	};

var connection;

    console.log('1. connecting to db:');
    connection = mysql.createConnection(db_config); // Recreate the connection, since
													// the old one cannot be reused.

    connection.connect(function(err) {              	// The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('2. error when connecting to db:', err);
        }                                     	// to avoid a hot loop, and to allow our node script to
    });                                     	// process asynchronous requests in the meantime.
    											// If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('3. db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
	
	connection.query('SELECT * from t_users', function(err, results) {

	var user_id = data.result.contexts[0].parameters.user_id;
	
	var mobile = data.result.contexts[0].parameters.phone;

	var id = results.length + 1;	

	var post  = {id: id , mobile: mobile , user_id: user_id};
		
	if(mobile && user_id)
	{
	connection.query('INSERT INTO t_users SET ?', post, function(err, rows, fields) {
	});	
	}

	});
    response.statusCode = 200;
	
    response.setHeader('Content-Type', 'application/json');	

	var speech = 'Your due amount to be paid is 100 Php.';	

	var token = process.env.FB_PAGE_TOKEN;

	//var checkSenderID = uuid.v1();
	//console.log('Sender ID check' + checkSenderID);
	//console.log(checkSenderID);
	//
	//sender =checkSenderID;
	
facebook_message = 

  messageData = {
	"attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Your due amount to be paid is 100 Php.",
        "buttons":[
          {
            "type":"web_url",
            "url":"https://www.sandbox.paypal.com/cgi-bin/webscr?return_url=Http://m.me/himantmusic&notify_url=http://hitman507bot.herokuapp.com/?payment="+sender+"&cmd=_xclick&business=himantgupta-facilitator@gmail.com&item_name=bot_chats&quantity=1&amount=100&currency_code=PHP",
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

    response.statusCode = 200;
	
    response.setHeader('Content-Type', 'application/json');	

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
	else{
	var speech = 'Oops. I am sorry, the OTP is wrong.';
	
    response.statusCode = 200;
	
    response.setHeader('Content-Type', 'application/json');	

	// GENERATE THE RESPONSE BODY - HIMANT - And SEND BACK THE RESPONSE TO CLIENT SPEECH Object
    if(sender != undefined)
	{
	var responseBody = {
        "speech": speech,
        "displayText": speech,
        "source": "apiai-Himant-OTP sample"
    };
	}
	
	}
	
}
	
    response.write(JSON.stringify(responseBody));
    response.end();
	
  });
  
}).listen((process.env.PORT || 5000), () => console.log("Server listening"));
