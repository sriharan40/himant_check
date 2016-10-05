/*!
 * apiai
 * Copyright(c) 2015 http://api.ai/
 * Apache 2.0 Licensed
 */

var http = require('http');
var apiai = require("./module/apiai");
//var apiai = require("apiai")

var app = apiai("c743619629b2490fab9751dac552094a");

var server = http.createServer(function(request, response) {
    if (request.result.action== 'sendOTP') {
        // var outStream = fs.createWriteStream('qwe.wav');
        var textRequest = app.textRequest();

        textRequest.on('response', function(_response) {
            _response ='I did it';
            response.end(JSON.stringify(_response));
            // var json = JSON.stringify({'resolvedQuery': _response['result']['resolvedQuery']})
            // response.end(json);
        });

        textRequest.on('error', function(error) {
            console.log(error);
            response.end();
        });

        textRequest.on('data', function(chunk) {
            textRequest.write(chunk);
        });

        request.on('end', function() {
            textRequest.end();
        });
    } else {
        response.writeHead(code, {});
        response.end();
    }

    console.log(request.headers);
});

server.listen(8000);

// cat ann_smith.wav | curl -v -X POST --data-binary @- -H "Transfer-Encoding: chunked" -H "Content-Type: audio/wav" http://localhost:8000/upload
