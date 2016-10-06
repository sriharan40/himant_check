/*!
 * apiai
 * Copyright(c) 2015 http://api.ai/
 * Apache 2.0 Licensed
 */

//var apiai = require("../module/apiai");
var apiai = require("apiai");

var app = apiai("c743619629b2490fab9751dac552094a");

var server = http.createServer(function(request, response) {
    
var options = {
    sessionId: '<UNIQE SESSION ID>'
}

var request = app.textRequest('Hello', options);

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();
    
)};
                               
server.listen(process.env.PORT || 3000);
