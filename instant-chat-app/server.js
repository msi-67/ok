const express = require('express');
const http = require('http');
const socketio = require("socket.io");
const cors = require('cors');
const app = express();
const server = http.createServer(app);

let users =0;  //a variable to keep the  count of active users
app.use(cors());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const io = require("socket.io")(http,  {
  cors: {
      origin: "http://localhost:3000"
  }
});
io.on("connection", function(socket) {
  users += 1; //increment the variable whenever a new user connects
  console.log("A new user connected");
  //
  //emits the number of active users at the given moment
  io.sockets.emit("users", { users: users });
  // emit welcome message to single user when connected
  socket.emit( "botMessage",  "Welcome to Chatbud! You are now connected to the group chat :D" );
  // emit to everyone except the client thats connected
  socket.broadcast.emit("botMessage", "A new user connected. Say Hi!");
  // emitting to all the clients
  // io.emit("welcomeMessage", "nise")
  // catching a received message from client
  socket.on("sentMessage", function(message) {
    console.log("Message: " + message);
    // sending message to other clients as their received message
    socket.broadcast.emit("receivedMessage", message);
  });
  // catching the nickname from client
  socket.on("nick", function(message) {
    console.log("From: " + message);
    // sending nick to other clients
    socket.broadcast.emit("nick", message);
  });
  socket.on("disconnect", function() {
    users = users - 1; //decrement the counter whenever a user disconnects
    io.sockets.emit("users", { users: users }); //emits the number of active users at the given moment
    console.log("A user disconnected");
    socket.broadcast.emit("botMessage", "A user disconnected from the chat");
  });
})
server.listen(process.env.PORT || 4000, () => {
    console.log('listening to port...');
});
