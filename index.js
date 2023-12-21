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
    const content = message.content;

    // Mesajı JSON formatında oluştur
    const jsonMessage = {
      sender: socket.id,
      content: content,
      timestamp: new Date(),
    };

    // Gönderilen mesajı hedef kullanıcıya JSON formatında ileti
    socket.to(targetSocketId).emit("receiveMessage", jsonMessage);
  });

  // Bağlantı kesildiğinde
  socket.on("disconnect", () => {
    console.log("Ayrıldı:", socket.id);
    delete connectedUsers[socket.id];
  });
});

// Dinleme yapılacak portu otomatik belirle
const PORT = process.env.PORT || 0; 
server.listen(PORT, () => {
  console.log(`Server başlatıldı. Port: ${server.address().port}`);
});
