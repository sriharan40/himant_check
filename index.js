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

var request = app.textRequest('Sriharan 8050582590',options);

// Load the twilio module

// Twilio Credentials 
var accountSid = 'ACe0b6cfbf60f11584099ee062db873252'; 

var authToken = '7468f40b17004327190847d04b4222ba'; 

//var client = require('twilio')(accountSid, authToken);

// Create a new REST API client to make authenticated requests against the
// twilio back end
//var client = new twilio.RestClient('ACe0b6cfbf60f11584099ee062db873252', '7468f40b17004327190847d04b4222ba');

// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.
client.sms.messages.create({
    to:'+918050582590',
    from:'+18312165009',
    body:'Testing Twilio with api ai'
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

request.on('response', function(response) {
    console.log(response);
    return response;
});

request.on('error', function(error) {
    console.log(error);
});

request.end();

const server = http.createServer((request, response) => response.end());

//Lets start our server
server.listen((process.env.PORT), () => console.log("Server listening"));
