const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { log } = require("console");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

const server = http.createServer(app); //for io

const io = new Server(server, {
  //io attached to server
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user Connected", socket.id); //for different users to get connected

  socket.on("send-msg", (message) => {
    //it listen from one client
    console.log(message);

    io.emit("recieved-msg", message); // Send this message to EVERY connected socket
  });

  socket.on("typing", (data) => {
    // Broadcast to everyone else that someone is typing
    socket.broadcast.emit("user-typing", data);
  });

  socket.on("add-reaction", (data) => {
    // Broadcast reaction to all connected sockets
    io.emit("recieved-reaction", data);
  });

  socket.on("disconnect", () => {
    console.log("user Disconnected", socket.id); //Once a user is connected, they have their own socket
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
