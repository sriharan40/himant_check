var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var request = require("request");
var util = require("util");
var http = require('http');
var apiai = require("apiai");
var requestPromise = require('minimal-request-promise');
var dashbot = require('./dashbot')(process.env.DASHBOT_API_KEY,
  {debug:true, urlRoot: process.env.DASHBOT_URL_ROOT}).facebook;
var api = apiai(process.env.APIAI_ACCESS_TOKEN);
const REST_PORT = (process.env.PORT || 5111);
	
var sender = "0";

var responseBody = "";
	
function processEvent(event) {
    sender = event.sender.id.toString();
	console.log("Sender:"+sender);
}

function track(recipient,message,timestamp){	
       request({
             url: 'https://botanalytics.co/api/v1/messages/facebook-messenger',
             body: JSON.stringify({message: message,
             recipient: recipient,
             timestamp:timestamp}),
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'Authorization': 'Token 3305dd579f76d3069692d9ab396f2548'
             }
     }, function(error, response, body){

         if(error) {
           console.log(body)
         } else {
           console.log(response.statusCode, body)
         }
    })
}
   
var options = {
    sessionId: Math.floor(1000000 + Math.random() * 9000000)
}

app.use(bodyParser.json());

app.post('/webhook', function(req, response) {
console.log(req.body);
/* var dashbotincoming =       
{ 
object: 'page',
entry: [
{
id: "165157840188738",	
time: new Date().getTime(),
messaging: [req.body.originalRequest.data]
}
]
};
track(null,dashbotincoming,new Date().getTime()) // incoming message, this call should be at the top of the webhook, and recipient should be null for the incoming messages.
dashbot.logIncoming(dashbotincoming); */

//http.createServer(function(req, response) {
  var headers = req.headers;
  var method = req.method;
 // var url = req.url;
//  var body = [];
var body = req.body;
//  req.on('error', function(err) {
//    console.error(err);
//  }).on('data', function(chunk) {
//	body += chunk;	  
//	console.log("Body: "+body);
  //console.log(body.customerName);
//  }).on('end', function() {
    //body = Buffer.concat(body).toString();	
try {
      //var data = JSON.parse(body);	
	  var data = body;

	  if (data.entry) {
	    console.log("Entry: "+data.entry); 
            let entries = data.entry;
            entries.forEach((entry) => {
                let messaging_events = entry.messaging;
                if (messaging_events) {
                    messaging_events.forEach((event) => {
                        if (event.message && !event.message.is_echo ||
                            event.postback && event.postback.payload) {
                            processEvent(event);
                        }
                    });
                }
            });
        }
		
      var action = data.result.action;
    } catch(e) {
        console.log('malformed request', body);
        //  return response.status(400).send('malformed request: ' + body);
    }
	  
      response.on('error', function(err) {
      console.error(err);
    });
	
	console.log("Action: "+action);

	console.log("Context1:"+JSON.stringify(data.result.contexts[0]));

	console.log("Context2:"+JSON.stringify(data.result.contexts[1]));

	console.log("Context3:"+JSON.stringify(data.result.contexts[2]));

	//console.log("Context4:"+JSON.stringify(data.result.contexts[3]));
	
if(action == "showOfferOptionsToUser")
{
var token = process.env.FB_PAGE_TOKEN;

//var sender = data.result.contexts[0].parameters.user_id;

console.log("Sender:"+sender);
	
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
	
var arr1 = [];

connection.query('select * from offers', function(err, rows, fields) {
    if (err) throw err; 
    for (var i in rows) {
         arr1.push({
            "type":"web_url",
            "url":rows[i].description,
            "title":rows[i].offer_name
          })
    }
	
facebook_message = 
messageData = {
"attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Select an offer:",
        "buttons": arr1
      }
    }   
   }		
  
   var requestData = {
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
        dashbotTemplateId: 'right',		  
        recipient: {id:sender},
        message: messageData,
      }
  };

request(requestData, function(error, res, body) {
//dashbot.logOutgoing(requestData, res.body);
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

// ---------------------------------------------TRANSFER TO CUSTOMER SUPPORT STARTS------------------------------
// ADD action for transfer to customer support - Himant - for FB agent
if ( action  == "unabletohandle")
{
	// Get by context name the variables.
	var availableAmt = 0 ;
	var rechargeAmount  = 0;
	var speech = 'I will transfer you to another agent, as I do not have enough knowledge to handle further.';
	var contextArray = data.result.contexts;
	var sender = 'Not Available';
	console.log ("Contexts array :" + contextArray);
   
    	for (var i=0, len=contextArray.length; i<len; i++) 
	{
		if (contextArray[i].name === "generic")
		{
			console.log("Found intro context and sender is" + contextArray[i].parameters.facebook_user);
			sender  = contextArray[i].parameters.facebook_user;
		}
		if (contextArray[i].name === "csrtransfer")
		{
			console.log("Conversation was passed to CSR");
			speech ="";
		}
	
    	}
	console.log ("Fb sender id :" + sender );
	// SEND TO FRONT DESK
	var http = require("https");

var options = {
  "method": "POST",
  "hostname": "api2.frontapp.com",
  "port": null,
  "path": "/channels/cha_1bav/incoming_messages",
  "headers": {
    "content-type": "application/json",
    "accept": "application/json",
    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiKiJdLCJpc3MiOiJmcm9udCIsInN1YiI6InBlX2lkZWFzX3JlcG9zaXRvcnkifQ.kYSMJ6mbLBWvdlfOxyIdRZ3gi4zGsRQXHLGOuicWA6s",
    "cache-control": "no-cache",
    
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});
 var messageSub = 'BotAlarm - Handle the conv with ' + sender;
console.log ('passing the name of sender now');
req.write(JSON.stringify({ sender: { name: 'BotNotification', handle: sender},
  subject: messageSub,
  body: messageSub,
  metadata: {} }));
req.end();
	
	// SEND TO FRONT DESK ENDS
	
	//console.log ("speech for recharge action is:" + speech);
	var responseBody = 
	{
        "speech": speech,
        "displayText": speech,
	"contextOut": [{"name":"csrtransfer", "lifespan":2, "parameters":{"csrtransffered":'Y'}}],
        "source": "apiai-Himant-OTP sample"
   	 };
	
	response.statusCode = 200;
	response.setHeader('Content-Type', 'application/json');	
	response.write(JSON.stringify(responseBody));
	response.end();

}
//End for CUSTOMER SUPPORT TRANSFER
//-------------------------------------------------------------------------------------------------------------------------
	

// ----------------------------------------------RECHARGE ACTION STARTS ------------------------------
// ADD action for recharge amount - Himant - its for voice portal agent
if ( action  == "rechargeAction")
{
	// Get by context name the variables.
	var availableAmt = 0 ;
	var rechargeAmount  = 0;
	var speech = 'No response';
	var contextArray = data.result.contexts;
	
	//console.log ("Contexts array :" + contextArray);
   
    	for (var i=0, len=contextArray.length; i<len; i++) 
	{
		if (contextArray[i].name === "userwantstorechargecontext")
		{
			availableAmt = parseInt(contextArray[i].parameters.initialBalance, 10);
			//console.log ("availabl amt:" + availableAmt);
			rechargeAmount = parseInt(contextArray[i].parameters.amountRequested, 10);
			//console.log ("recharge amt:" + rechargeAmount);
		}
	
    	}
	
	
	if ( rechargeAmount > availableAmt)
	{
		speech = "Your available Jio balance is " + availableAmt + ". Please use an amount less than your available amount.";
		//console.log("Its not ok:" + speech);
	}
	else 
	{
		var displayRemAmt = availableAmt - rechargeAmount;
		speech = "Recharge successful. Your remaining jio amount is " + displayRemAmt + ". Your prepaid balance is now " + rechargeAmount;
		//console.log("Its allowed:" + speech);
	}
	
	//console.log ("speech for recharge action is:" + speech);
	var responseBody = 
	{
        "speech": speech,
        "displayText": speech,	 
        "source": "apiai-Himant-OTP sample"
   	 };
	
	response.statusCode = 200;
	response.setHeader('Content-Type', 'application/json');	
	response.write(JSON.stringify(responseBody));
	response.end();

}
//End for recharge action
//-------------------------------------------------------------------------------------------------------------------------

// START ACTION TO LAUNCH BROWSER
if (action == "openlink")
{
var opener = require('opener');
opener('http://google.com');
response.end();
}
	
	
// END ACTION TO LAUNCH BROWSER
	
// Add action for context passed from portal
if(action == "FBCheckBoxStuckInAddNewOffer")
{
var token = process.env.FB_PAGE_TOKEN;

var sender = data.result.contexts[1].parameters.facebook_user_id;

console.log("Sender from portal is:"+sender);

	var speech = 'Hey, I am good, I have been made to do a POC for voice check by Himant.How can I help you today?';

	var responseBody = {
        "speech": speech,
        "displayText": speech,	 
        "source": "apiai-Himant-OTP sample"
    };
}// End if Action ==
	
// TEST THE SPEECH ACTION : HIMANT
	if (action == "PortalAgentSpeechIntroduction")
	{
	var speech = 'Hey, I am good, I have been made to do a POC for voice check by Himant.How can I help you today?';
	console.log("Inside speech test");
	var responseBody = 
	    {
		"speech": speech,
		"displayText": speech,	 
		"source": "apiai-Himant-OTP sample"
    		};
	
	 console.log("Outside speech test");
	}
	

	// TEST ENDS

// Add action ends
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
// -------------------------- Action is to send location.
if (action == "sendlocation")
{
	var speech = "Please share your location";
	var responseBody = 
	{
        "speech": speech,
        "displayText": speech,	
	"data":{	"facebook": 
			{
   			 "text":"Please share your location:",
    				"quick_replies":[
      					{
        				"content_type":"location",
      					}
    				]
  			}
	     },
        "source": "apiai-Himant-OTP sample"
   	 };
	
	response.statusCode = 200;
	response.setHeader('Content-Type', 'application/json');	
	response.write(JSON.stringify(responseBody));
	response.end();
	
}
	
// ---------------------------Action to send location ends
if(action == "showOptionsToUser")
{
	var token = process.env.FB_PAGE_TOKEN;

	var sender = data.result.contexts[1].parameters.facebook_user_id;
	
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
var requestData = {
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
        dashbotTemplateId: 'right',		  
        recipient: {id:sender},
        message: messageData,
      }
};

request(requestData, function(error, res, body) {  
//track(sender,messageData,new Date().getTime()) // out-going generic template message, this call should be at the bottom of the message send method.
//dashbot.logOutgoing(requestData, res.body);	  
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
 
// GET Customer Information
if(action == "getCustomerByMSISDN")
{
var msisdn = data.result.parameters.customerNumber;

var Curl = require( 'node-libcurl' ).Curl;

var curl = new Curl();

var url = process.env.BSS_TOKEN_URL;

var data = process.env.BSS_CREDENTIALS;                                                                  

var customSpeech = "";

response.statusCode = 200;
	
response.setHeader('Content-Type', 'application/json');	

curl.setOpt(Curl.option.URL, url);
curl.setOpt(Curl.option.POSTFIELDS, data);    
curl.setOpt(Curl.option.HEADER, true);                                                              
curl.setOpt(Curl.option.HTTPHEADER, ['Content-Type: application/json'] );                                                                                                                            

curl.perform();

curl.on('end', function( statusCode, body, headers ) {
	
var token = headers[0].uxfauthorization;

var curl1 = new Curl();
	
var url1 = process.env.BSS_GETCUST_BASIC_INFO_REST_URL +msisdn+'/msisdn';

curl1.setOpt(Curl.option.URL, url1);
curl1.setOpt(Curl.option.HTTPHEADER, [
'Content-Type: application/json',
'Authorization:'+ token
]);                                                                                                                            

curl1.perform();

curl1.on('end', function( statusCode1, body1, headers1 ) {

var curl2 = new Curl();

console.log("Body:"+JSON.stringify(body1));

if(JSON.parse(body1).CustomerDetailsL == undefined || JSON.parse(body1).CustomerDetailsL == "")
{
var userBalance = "userBalance";
}

else
{
var userBalance = JSON.parse(body1).CustomerDetailsL.customerID;
}
	
var url2 = process.env.BSS_GETCUST_BASIC_INFO_REST_URL +userBalance+'/userBalance';

console.log("Url is :" + url2);

curl2.setOpt(Curl.option.URL, url2);
curl2.setOpt(Curl.option.HTTPHEADER, [
'Content-Type: application/json',
'Authorization:'+ token
]);                                                                                                                            

curl2.perform();

curl2.on('end', function( statusCode2, body2, headers2 ) {
	
// GENERATE THE RESPONSE BODY - HIMANT - And SEND BACK THE RESPONSE TO CLIENT SPEECH Object
//facebook_message = body1;
var parsedResponse1 = JSON.parse(body1);

var parsedResponse2 = JSON.parse(body2);

console.log ("Parsed status is : " + JSON.stringify(statusCode2));

console.log ("Parsed JSON response is : " + JSON.stringify(parsedResponse2));

if(JSON.parse(body1).CustomerDetailsL == undefined || JSON.parse(body1).CustomerDetailsL == "")
{
var customSpeech = "Please check the number you have entered.";
}

else
{
var customSpeech = "Hi "+parsedResponse1.CustomerDetailsL.name+", Your outstanding balance is "+parsedResponse2.UserBalanceResponse.balanceX9+" and you are a "+parsedResponse1.CustomerDetailsL.paymentCategory+" subscriber.";
}

//var customSpeech = body1;

var responseBody = {
"speech": customSpeech,
"displayText": customSpeech,
"source": "apiai-Himant-OTP sample"
//"data": {"facebook": {facebook_message}}
};

response.write(JSON.stringify(responseBody));

//req.end();

response.end();

console.log ("Response is :" + JSON.stringify(responseBody));

curl2.close();
});		
curl1.close();
});
curl.close();
});

}
 
 
// OTP Validation
 
// TWILIO SMS
if(action == "sendOTP")
{
	var otp = Math.floor(1000 + Math.random() * 9000);
	console.log(otp);
	var name = data.result.parameters.customerName;
	var mobile = '+'+data.result.parameters.phone;
	var speech = name + ', We will send you an OTP on your number ' + mobile +'. Please reply back here with that OTP.';

	//var value = name + mobile;

	//var req = api.textRequest(value, options);
	
	// Load the twilio module

	// Twilio Credentials 
	var accountSid = process.env.accountSid;
	var authToken = process.env.authToken;

	var client = require('twilio')(accountSid, authToken);

	client.sms.messages.create({
	   to: mobile,
	   from: process.env.Twilio_from_number,
	   body: 'Your one time password for verficiation is :' + otp
	}, function(error, message) {
	  
	  if (!error) {
		//console.log('Success! The SID for this SMS message is:');
		//console.log(message.sid);

		//console.log('Message sent on:');
		//console.log(message.dateCreated);
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
	    "contextOut": [{"name":"otp_check", "lifespan":2, "parameters":{"number":otp}}],
        "source": "apiai-Himant-OTP sample"
	};

response.write(JSON.stringify(responseBody));
console.log ("Response is :" + JSON.stringify(responseBody));
//req.end();
response.end();
	
}

if(action == "validateOTP")
{
	var otp1 = data.result.parameters.inputOTP;

	var contextArray = data.result.contexts;
	
	console.log ("Contexts array :" + contextArray);
   
    for (var i=0, len=contextArray.length; i<len; i++) {
        if (contextArray[i].name === "otp_check")
	{
    	var otp_check1 = contextArray[i].parameters.number;
    	}
	if(contextArray[i].name === "generic")
	{	
	var sender = contextArray[i].parameters.facebook_user_id;
    	}
    }
	console.log("Otp:"+otp_check1);
	
	console.log("Sender:"+sender);

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

    for (var i=0, len=contextArray.length; i<len; i++) {
	if(contextArray[i].name === "generic")
	{	
	var user_id = contextArray[i].parameters.facebook_user_id;
	var mobile = contextArray[i].parameters.phone;	
    	}
    }

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

	var speech = 'Your due amount to be paid is 2 USD.';	

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
        "text":"Your due amount to be paid is 2 USD.",
        "buttons":[
          {
            "type":"web_url",
            "url":"https://www.sandbox.paypal.com/cgi-bin/webscr?return_url=Http://m.me/digitaldemofortelcos&notify_url=http://demofordigitaltelco.herokuapp.com/?payment="+sender+"&cmd=_xclick&business=himantgupta-facilitator@gmail.com&item_name=bot_chats&quantity=1&amount=2&currency_code=USD",
            "title":"Pay with PayPal"
          }
	  ]

	 }	
   }	  
}
   var requestData = {
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
        dashbotTemplateId: 'right',		  
        recipient: {id:sender},
        message: messageData,
      }
  };

request(requestData, function(error, response, body) {
//track(sender,messageData,new Date().getTime()) // out-going generic template message, this call should be at the bottom of the message send method.
//dashbot.logOutgoing(requestData, response.body);
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
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

    else
	{
	var responseBody = {
        "speech": speech,
        "displayText": speech,
        "source": "apiai-Himant-OTP sample"
    };
	}
response.write(JSON.stringify(responseBody));
console.log ("Response is :" + JSON.stringify(responseBody));
//req.end();
response.end();	
	
	}
	else{
	var speech = 'Oops. I am sorry, the OTP is wrong.';
	
    response.statusCode = 200;
	
    response.setHeader('Content-Type', 'application/json');	

	// GENERATE THE RESPONSE BODY - HIMANT - And SEND BACK THE RESPONSE TO CLIENT SPEECH Object
   // if(sender != undefined)
   // {
	var responseBody = {
        "speech": speech,
        "displayText": speech,
        "source": "apiai-Himant-OTP sample"
    };
	// }

response.write(JSON.stringify(responseBody));
console.log ("Response is :" + JSON.stringify(responseBody));
req.end();
response.end();	
		
}
	

}


// Bot Training Section

if(action == "createIntentAction")
{
var intent_name = data.result.parameters.intentName;

var user_expressions = data.result.parameters.textUserExpressions;

var intent_data = {
   name: intent_name,
   auto: false,
   userSays: [
      {
        data: [{"text": user_expressions}],
        isTemplate: false,
        count: 0    
      }],
 responses: [
      {
         resetContexts: false,
         action: '',
         affectedContexts: [],
         parameters: [],
         speech: ''
      }
   ],
   priority: 500000
};

var contextArray = data.result.contexts;

var responseBody = "";

var speech = "";

for (var i=0, len=contextArray.length; i<len; i++) {
if(contextArray[i].name === "backendexpressionscontinuedcontext")
{
var intent_id = contextArray[i].parameters.intent_id;	
}
}

if (intent_id == "" || intent_id == undefined)
{
var options = {
  method: 'POST',
  url: 'https://api.api.ai/v1/intents',
  qs: { v: '20150910' },  
  headers: {
    'authorization': 'Bearer '+process.env.apiai_developer_access_token,
    'Content-Type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache'
  },
  json: intent_data
};

console.log("Options:"+JSON.stringify(options));

request(options, function (error, res, body) {
  if (error) throw new Error(error);

  console.log(body);

var speech = "Ok, great, how else the user can ask this question?";	

// GENERATE THE RESPONSE BODY - HIMANT - And SEND BACK THE RESPONSE TO CLIENT SPEECH Object
var responseBody = {
"speech": speech,
"displayText": speech,
"contextOut": [{"name":"backendexpressionscontinuedcontext", "lifespan":1, "parameters":{"intent_id":body.id}}],
"source": "apiai-Himant-OTP sample"
};

response.statusCode = 200;
	
response.setHeader('Content-Type', 'application/json');	

response.write(JSON.stringify(responseBody));

console.log ("Response is :" + JSON.stringify(responseBody));
//req.end();
response.end();	

});

}

else
{
var options1 = {
  method: 'GET',
  url: 'https://api.api.ai/v1/intents/'+intent_id,
  qs: { v: '20150910' },  
  headers: {
    'authorization': 'Bearer '+process.env.apiai_developer_access_token,
    'Content-Type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache'
  }
};

var speech = "Teach me other ways , the user can ask this question. Once done, please write @done";	

   // GENERATE THE RESPONSE BODY - HIMANT - And SEND BACK THE RESPONSE TO CLIENT SPEECH Object
 var responseBody = {
	"speech": speech,
	"displayText": speech,
	"contextOut": [{"name":"backendexpressionscontinuedcontext", "lifespan":1, "parameters":{"intent_id":intent_id}}],
	"source": "apiai-Himant-OTP sample"
};

request(options1, function (error, res, body) {
  if (error) throw new Error(error);

console.log(body);

var user_says_data[] = body.userSays;

user_says_data.push({"text": user_expressions});

var intent_data = {
   name: intent_name,
   auto: false,
   userSays: user_says_data,
responses: [
      {
         resetContexts: false,
         action: '',
         affectedContexts: [],
         parameters: [],
         speech: ''
      }
   ],
   priority: 500000
};
  
var options = {
  method: 'PUT',
  url: 'https://api.api.ai/v1/intents/'+intent_id,
  qs: { v: '20150910' },  
  headers: {
    'authorization': 'Bearer '+process.env.apiai_developer_access_token,
    'Content-Type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache'
  },
  json: intent_data
};

console.log("Options:"+JSON.stringify(options));
  
request(options, function (error1, res1, body1) {
  if (error) throw new Error(error);

  console.log(body1);
});  

});

response.statusCode = 200;
	
response.setHeader('Content-Type', 'application/json');	

response.write(JSON.stringify(responseBody));

console.log ("Response is :" + JSON.stringify(responseBody));
//req.end();
response.end();	

}
	
}

if(action == "updateIntent")
{
	var intent_name = data.result.parameters.intentName;

	var user_expressions = data.result.parameters.textUserExpressions;

var intent_data = {
   name: intent_name,
   auto: true,
   userSays: [
      {
         data: [{"text": user_expressions}],
        isTemplate: false,
        count: 0    
      }],
 responses: [
      {
         resetContexts: false,
         action: '',
         affectedContexts: [],
         parameters: [],
         speech: ''
      }
   ],
   priority: 500000
};

var options = {
  method: 'PUT',
  url: 'https://api.api.ai/v1/intents/76fc8b99-1f0c-4fd9-8448-66ff2a402326',
  qs: { v: '20150910' },  
  headers: {
    'authorization': 'Bearer '+process.env.apiai_developer_access_token,
    'Content-Type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache'
  },
  json: intent_data
};

console.log("Options:"+JSON.stringify(options));

request(options, function (error, res, body) {
  if (error) throw new Error(error);

  console.log(body);
});

/* var options = {
  method: "POST",
  host: "api.api.ai",
  port: null,
  path: "/v1/intents?v=20150910",
  headers: {
    "authorization": "Bearer "+process.env.apiai_developer_access_token,
    "Content-Type": "application/json; charset=utf-8",
    "cache-control": "no-cache"
  },
  body: intent_data
};

return requestPromise(options).then(
  function (response) {
    console.log('Got success: '+JSON.stringify(response.body));
  },
  function (response) {
    console.log('Got error', response.body, response.headers, response.statusCode, response.statusMessage);
  }
); */
	
	var speech = "Teach me other ways , the user can ask this question. Once done, please write @done";	

	response.statusCode = 200;
		
	response.setHeader('Content-Type', 'application/json');	

		   // GENERATE THE RESPONSE BODY - HIMANT - And SEND BACK THE RESPONSE TO CLIENT SPEECH Object
		 var responseBody = {
			"speech": speech,
			"displayText": speech,
			"contextOut": [{"name":"backendexpressionscontinuedcontext", "lifespan":2}],
			"source": "apiai-Himant-OTP sample"
		};

	response.write(JSON.stringify(responseBody));
	console.log ("Response is :" + JSON.stringify(responseBody));
	//req.end();
	response.end();	
	
}

});


//app.listen(process.env.PORT || 5000);
app.listen(REST_PORT, () => {
    console.log('Rest service ready on port ' + REST_PORT);
});
