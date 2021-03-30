/*
const io = require('socket.io')();

io.on('connection', (client) => {
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });

  client.on("holi",()=>{console.log('adios')});
});

io.on("holi", ()=>{
  console.log('xao');
});
const port = 8000;
io.listen(port);
console.log('listening on port ', port);
*/
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

//Port from environment variable or default - 4001
const port = process.env.PORT || 4001;

//Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//Setting up a socket with the namespace "connection" for new sockets
io.on("connection", socket => {
    console.log("New client connected");

    //Here we listen on a new namespace called "incoming data"
    socket.on("incoming data", (data)=>{
        //Here we broadcast it out to all other sockets EXCLUDING the socket which sent us the data
       socket.broadcast.emit("outgoing data", {num: data});
    });

    //A special namespace "disconnect" for when a client disconnects
    socket.on("disconnect", () => console.log("Client disconnected"));
		socket.on("holi",async ()=>console.log('xao'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));

