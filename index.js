var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var request = require("request");
var util = require("util");
var http = require('http');
var apiai = require("apiai");
var dashbot = require('./dashbot')(process.env.DASHBOT_API_KEY,
  {debug:true, urlRoot: process.env.DASHBOT_URL_ROOT}).facebook;
var api = apiai(process.env.APIAI_ACCESS_TOKEN);
const REST_PORT = (process.env.PORT || 5090);
	
var sender = "0";
	
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
  var url = req.url;
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

	console.log("Context4:"+JSON.stringify(data.result.contexts[3]));
	
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
dashbot.logOutgoing(requestData, res.body);
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
track(sender,messageData,new Date().getTime()) // out-going generic template message, this call should be at the bottom of the message send method.
dashbot.logOutgoing(requestData, res.body);	  
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

url = process.env.BSS_TOKEN_URL;

var data = process.env.BSS_CREDENTIALS;                                                                  

curl.setOpt(Curl.option.URL, url);
curl.setOpt(Curl.option.POSTFIELDS, data);    
curl.setOpt(Curl.option.HEADER, true);                                                              
curl.setOpt(Curl.option.HTTPHEADER, ['Content-Type: application/json'] );                                                                                                                            

curl.perform();

curl.on('end', function( statusCode, body, headers ) {
	
var token = headers[0].uxfauthorization;

var curl1 = new Curl();
	
url1 = process.env.BSS_GETCUST_BASIC_INFO_REST_URL +msisdn+'/msisdn';

curl1.setOpt(Curl.option.URL, url1);
curl1.setOpt(Curl.option.HTTPHEADER, [
'Content-Type: application/json',
'Authorization:'+ token
]);                                                                                                                            

curl1.perform();

curl1.on('end', function( statusCode1, body1, headers1 ) {
	
response.statusCode = 200;
	
response.setHeader('Content-Type', 'application/json');	

// GENERATE THE RESPONSE BODY - HIMANT - And SEND BACK THE RESPONSE TO CLIENT SPEECH Object
var responseBody = {
"speech": body1,
"displayText": body1,
"source": "apiai-Himant-OTP sample"
};
response.write(JSON.stringify(responseBody));
console.log ("Response is :" + JSON.stringify(responseBody));
response.end();
	
curl1.close();
});
curl.close();
});

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

	var req = api.textRequest(value, options);
	
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
	    "contextOut": [{"name":"otp_check", "lifespan":2, "parameters":{"number":otp}}],
        "source": "apiai-Himant-OTP sample"
	};

response.write(JSON.stringify(responseBody));
console.log ("Response is :" + JSON.stringify(responseBody));
response.end();
	
}

if(action == "validateOTP")
{
	var otp1 = data.result.parameters.inputOTP;

	var otp_check1 = data.result.contexts[2].parameters.number;
	
	var sender = data.result.contexts[0].parameters.facebook_user_id;

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

	var user_id = data.result.contexts[1].parameters.facebook_user_id;
	
	var mobile = data.result.contexts[1].parameters.phone;

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
            "url":"https://www.sandbox.paypal.com/cgi-bin/webscr?return_url=Http://m.me/digitaldemofortelcos&notify_url=http://demofordigitaltelco.herokuapp.com/?payment="+sender+"&cmd=_xclick&business=himantgupta-facilitator@gmail.com&item_name=bot_chats&quantity=1&amount=100&currency_code=PHP",
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
track(sender,messageData,new Date().getTime()) // out-going generic template message, this call should be at the bottom of the message send method.
dashbot.logOutgoing(requestData, response.body);
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
	
	}
	
response.write(JSON.stringify(responseBody));
console.log ("Response is :" + JSON.stringify(responseBody));
response.end();	

}
    
});

//app.listen(process.env.PORT || 5000);
app.listen(REST_PORT, () => {
    console.log('Rest service ready on port ' + REST_PORT);
});
