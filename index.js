const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 7162;
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(express.json());
app.use(cors());

try {
  io.on("connection", (socket) => {
    console.log("connected");
    console.log(socket.id, "has joined");

    // /test endpoint'ine gelen POST isteğini dinleyen route
    app.post("/test", (req, res) => {
      const receivedData = req.body;
      console.log("Received data from /test endpoint:", receivedData);

      // Burada gelen veriyi işleyebilir ve gerekirse soketleri güncelleyebilirsiniz
      io.emit("testEvent", receivedData); // Tüm soketlere gelen veriyi ilet
      res.status(200).json({ success: true, message: "Data received successfully" });
    });
  });
} catch (error) {
  console.log(error);
}

server.listen(port, () => {
  console.log("Server started on port", port);
});
