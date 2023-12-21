const express = require("express");
const http = require("http");
const io = require("socket.io");

const app = express();
const server = http.createServer(app);
const socketIo = io(server);

const connectedUsers = {};

socketIo.on("connection", (socket) => {
  console.log("Bağlandı:", socket.id);

  // Yeni kullanıcı bağlandığında
  socket.on("registerUser", (userData) => {
    connectedUsers[socket.id] = userData;

    // Diğer kullanıcılara yeni kullanıcıyı bildir
    socket.broadcast.emit("newUser", userData);
  });

  // Mesaj alındığında
  socket.on("sendMessage", (message) => {
    // Mesajı hedef kullanıcıya gönder
    const targetSocketId = message.targetSocketId;
    socket.to(targetSocketId).emit("receiveMessage", message);
  });

  // Bağlantı kesildiğinde
  socket.on("disconnect", () => {
    console.log("Ayrıldı:", socket.id);
    delete connectedUsers[socket.id];
  });
});

server.listen(3000, () => {
  console.log("Server başlatıldı. Port: 3000");
});
