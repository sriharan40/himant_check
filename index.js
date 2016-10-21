var express = require('express');
var router = express();
var request = require("request");
var util = require("util");
var http = require('http');
var apiai = require("apiai");

var app = apiai(process.env.APIAI_ACCESS_TOKEN);

var options = {
    sessionId: Math.floor(1000000 + Math.random() * 9000000)
}

http.createServer(function(req, response) {
  var headers = req.headers;
  var method = req.method;
  var url = req.url;
  var body = [];

var params=function(req){
  try{
  var q=req.url.split('?'),result={};
  if(q.length>=2){
      q[1].split('&').forEach((item)=>{
           try {
             result[item.split('=')[0]]=item.split('=')[1];
           } catch (e) {
             result[item.split('=')[0]]='';
           }
      })
  }
  }
  catch(e) {
             result='';
		 // console.log('malformed request', body);
        //  return response.status(400).send('malformed request: ' + body);
    }
  return result;
}

//console.log(req);

var value = params(req).payment;

console.log('Value: '+value);

if(value != "" && value != undefined)
{
req.params=params(req);

var token = process.env.FB_PAGE_TOKEN;

if(req.params != "" && req.params != undefined)
{
var receiver = req.params.payment;
//var sender = data.result.contexts[0].parameters.user_id;

var status = req.params.payment;

console.log('Payment: '+status);
}

if(status)
{
var text = "Congratulations your payment done successfully.";	
}

//if(receiver && text)
//{	
//sendTextMessage(receiver, text, response);
//}

//function sendTextMessage(receiver, text, response) {

facebook_message1 = 

  messageData = {
"attachment":{
      "type":"template",
      "payload":{
        "template_type":"receipt",
        "recipient_name":"Sriharan",		
        "order_number":"12345678902",
        "currency":"USD",
        "payment_method":"PayPal",        
        "timestamp":"1428444852", 
        "elements":[
          {
            "title":"Congratulations for the Payment",
            "subtitle":"Payment Success",
            "quantity":1,
            "price":1,
            "currency":"USD",
          }
		 ],
        "summary":{
          "subtotal":1.00,
          "total_cost":1.00
        }
      }
    }
  }	  

  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
        //recipient: {phone_number:sender},
	recipient: {id:receiver},
        message: messageData,
      }
  }, function(error, res, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (res.body.error) {
      console.log('Error: ', res.body.error);
	  }  
	  });

	      response.statusCode = 200;
	
		  response.setHeader('Content-Type', 'application/json');
	  
	var responseBody = {
        "speech": text,
        "displayText": text,	 
		"data": {"facebook": {facebook_message1}},		
        "source": "apiai-Himant-OTP sample"
    };	  	  
//}

}
  
  req.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk) {
	body += chunk;	  
        
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
        "title":"Outstanding Balance",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
      },
      {
        "content_type":"text",
        "title":"My Bills",
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
	var mobile = '+63'+data.result.parameters.phone;
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
	"contextOut": [{"name":"otp_check", "lifespan":1, "parameters":{"number":otp}}],
        "source": "apiai-Himant-OTP sample"
	};

}

if(action == "validateOTP")
{
	var otp1 = data.result.parameters.inputOTP;

	var otp_check1 = data.result.contexts[2].parameters.number;

	if(otp1 == otp_check1)
	{
	//var speech = 'Thanks for confirmation.May I know your concerns now? Let us resolve one by one.)';
    response.statusCode = 200;
	
    response.setHeader('Content-Type', 'application/json');	

	var speech = 'Your due amount to be paid is 1000 Php.';	

	var token = process.env.FB_PAGE_TOKEN;

	var sender = data.result.contexts[0].parameters.user_id;
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
        "text":"Your due amount to be paid is 1000 Php.",
        "buttons":[
          {
            "type":"web_url",
            "url":"https://www.sandbox.paypal.com/cgi-bin/webscr?return_url=Http://m.me/himantmusic&notify_url=https://bot-chats.herokuapp.com/?payment="+sender+"&cmd=_xclick&business=himantgupta-facilitator@gmail.com&item_name=bot_chats&quantity=1&amount=1&currency_code=USD",
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
	  
	}
	else{
	var speech = 'Oops. I am sorry, the OTP is wrong.';	
	}

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


/* if(action == "getOutstandingBalance")
{
    response.statusCode = 200;
	
    response.setHeader('Content-Type', 'application/json');	

	var speech = 'Your due amount to be paid is 1000 Php.';	

	var token = process.env.FB_PAGE_TOKEN;

	var sender = data.result.contexts[0].parameters.user_id;
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
        "text":"Your due amount to be paid is 1000 Php.",
        "buttons":[
          {
            "type":"web_url",
            "url":"https://www.sandbox.paypal.com/cgi-bin/webscr?return_url=Http://m.me/himantmusic&notify_url=https://bot-chats.herokuapp.com/?payment="+sender+"&cmd=_xclick&business=himantgupta-facilitator@gmail.com&item_name=bot_chats&quantity=1&amount=1&currency_code=USD",
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
}*/
	
    response.write(JSON.stringify(responseBody));
    response.end();
	
  });
}).listen((process.env.PORT || 5000), () => console.log("Server listening"));
