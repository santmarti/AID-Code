/**
 * Code taken and adapted from project https://github.com/xanderkoo/hear-me-move
 * And its also code adapted from @noisyneuron https://github.com/noisyneuron/wekOsc
 */

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var osc = require('osc-min');
var dgram = require('dgram');

var remoteIp = '127.0.0.1';
var remotePort = 6448; // use wekinator default input port
var serverPort = 3000; // use default p5js server port

var udp = dgram.createSocket('udp4');

/**
 * using localhost
 * change this for your setup in this file as well as index.html
*/

server.listen(serverPort);

sendHeartbeat = function(arr) {
  var buf;
  var argsArr = [];
  for (let i = 0; i < 34; i++) {
    coord = arr[i];
    argsArr.push({type: "float", value: coord || 0});
  }
  // console.log(argsArr);
  try {
    buf = osc.toBuffer({
      address: "/wek/inputs",
      args: argsArr
    });
  } catch (error) {
    console.log(error, argsArr);
  }

  return udp.send(buf, 0, buf.length, remotePort, "localhost");
};

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/:filename', function (req, res) {
  res.sendFile(__dirname + '/' + req.params.filename);
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('singlePose', function (data) {
    // console.log(data);
    sendHeartbeat(data);
  });
});

console.log("Open   http://localhost:" + serverPort + "   in a browser, poseNet will run and send OSC /wek/inputs with 34 float to port " + remotePort);
