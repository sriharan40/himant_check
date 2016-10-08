var http = require('http')  
var express = require('express');
//var router = express.Router();
var router = express();
var util = require("util");
var apiai = require("apiai");

var app = apiai("c743619629b2490fab9751dac552094a");
var appexp = express();

var options = {
    sessionId: '<UNIQE SESSION ID>'
}

//const port = 3000

app.get('/:customerName', (request, response) => {  
    console.log ('Customer name is:' + request.params.customerName);
  response.send('Hello from Express!')
})

app.listen(process.env.PORT, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${process.env.PORT}`)
})

