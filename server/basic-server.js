/* Import node's http module: */
var http = require("http");
//var reqHandler = require("./request-handler.js");
var express = require('express');
var _ = require('underscore');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
var storage = [
  { roomname: 'lobby', username: 'abcd', text: 'How are you?', createdAt: 'Tue, 27 Oct 2015 14:54:07 GMT'},
  { roomname: 'lobby', username: 'xyz', text: 'Great!', createdAt: 'Tue, 27 Oct 2015 14:54:13 GMT'},
  { roomname: 'room1', username: 'xyz', text: 'How are you?', createdAt: 'Tue, 27 Oct 2015 14:54:18 GMT'},
  { roomname: 'room1', username: 'abcd', text: 'Great!', createdAt: 'Tue, 27 Oct 2015 14:54:22 GMT'},
  { roomname: 'room32', username: 'xyz', text: 'How are you?', createdAt: 'Tue, 27 Oct 2015 14:54:28 GMT'},
  { roomname: 'room32', username: 'abcd', text: 'Tired of you asking!', createdAt: 'Tue, 27 Oct 2015 14:54:35 GMT'}
];



// Every server needs to listen on a port with a unique number. The
// standard port for HTTP servers is port 80, but that port is
// normally already claimed by another server and/or not accessible
// so we'll use a standard testing port like 3000, other common development
// ports are 8080 and 1337.
var port = 3000;

// For now, since you're running this server on your local machine,
// we'll have it listen on the IP address 127.0.0.1, which is a
// special address that always refers to localhost.
var ip = "127.0.0.1";

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('combined'));


var server = app.listen(port, ip, function () {
  console.log("Server is listening at http://%s:%s", ip, port);
});

// app.all("*", function (req, res, next) {
//   console.log("Making a request of type " + req.method + " at location " + req.url);
// })

//app.METHOD( URL , CB )
//
// app.all('/', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, Null, X-Requested-With, Content-Type, Acceptß");
//   next();
//  });

app.get('/classes/messages' , function (req, res, next) {
  res.send({results: storage});
  res.end();
  next();
});

app.route('/classes/:room')
  .get(function(req, res) {
    var filter = _.filter(storage, function(val){
      if(val.roomname === req.params.room) {
        return val;
      }
    });
   res.json({results: filter});
   res.end();
  })
  .post(function (req, res, next) {
    var data = req.body;
    if (!data.hasOwnProperty('username') || !data.hasOwnProperty('message') || Object.keys(data).length !== 2) { //number of keys may be 3
      console.error('Invalid username/message text or properties');
    }
    data.createdAt = new Date();
    data.roomname = req.params.room;
    storage.push(data);
    res.status(201);
    res.end();
    next();
  });

app.post('/send', function (req, res, next) {
  var data = req.body;
  if (!data.hasOwnProperty('username') || !data.hasOwnProperty('message') || Object.keys(data).length > 3) { //number of keys may be 3
    console.error('Invalid username/message text or properties');
  }
  data.roomname = data.roomname || 'lobby';
  data.createdAt = new Date();
  storage.push(data);
  //res.send("Success")
  res.status(201);
  res.end();
  next();
  //console.log(req.body);
});

// app.post('/classes/:room', function (req, res) {
//   var data = req.body;
//   data.createdAt = new Date();
//   data.roomname = req.params.room;
//   storage.push(data);
//   //res.send("Success")
//   res.status(201);
//   res.end();
//   //console.log(req.body);
// });



// We use node's http module to create a server.
//
// The function we pass to http.createServer will be used to handle all
// incoming requests.
// After creating the server, we will tell it to listen on the given port and IP. */
// var server = http.createServer(reqHandler.requestHandler);
// console.log("Listening on http://" + ip + ":" + port);
// server.listen(port, ip);

// To start this server, run:
//
//   node basic-server.js
//
// on the command line.
//
// To connect to the server, load http://127.0.0.1:3000 in your web
// browser.
//
// server.listen() will continue running as long as there is the
// possibility of serving more requests. To stop your server, hit
// Ctrl-C on the command line.

