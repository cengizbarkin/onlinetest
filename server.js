require('./config/config');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const port = process.env.PORT;


let app = express();
let server = http.createServer(app);
let io = socketIO(server);

let playerCount = 0;

let time1;
let time2;

io.on('connect', (socket) => {

  socket.emit('firstConnection');
  console.log('Client connected');

  socket.broadcast.emit('spawn');
  playerCount++;

  for (var i = 0; i < playerCount; i++) {
    socket.emit('spawn');
    console.log('Sending spawnt to new player');
  }

  socket.on('move', () => {
    console.log('moved');
  });

  //Client'a Socket tetikle ve CallBack döndüğü zamanki süreyi hesapla
  socket.on('SendCallbackGetTheTime', (data1, data2, callback) => {
    console.log(data1);
    console.log(data2);
    callback();
    console.log('Callback çağırıldı');
  });

  socket.on('fromClient', (data) => {
    time1 = new Date().valueOf();
    //time1 = (new Date).getTime();
    socket.emit('gotIt');

  });

  socket.on('thanks', () => {
    time2 = new Date().valueOf()
    //time2 = (new Date).getTime();
    //console.log((new Date).getTime());
    console.log(time2-time1);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    playerCount--;
  });


});


server.listen(port, () => {
  console.log(`server is up on ${port}`);
});
