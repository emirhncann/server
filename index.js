const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

try {
  io.on("connection", (socket) => {
    console.log("Bağlandı:", socket.id);

    socket.on("testEvent", (data) => {
      console.log('Sunucudan gelen veri:', data);
    });
  });

  // Örnek dinamik endpoint
  app.post("/dynamic/:endpointName", (req, res) => {
    const endpointName = req.params.endpointName;
    const receivedData = req.body;

    console.log(`Gelen veri /${endpointName} endpoint:`, receivedData);

    // Burada endpointName'e göre özel işlemler yapabilirsiniz.

    io.emit(`${endpointName}Event`, receivedData);
    res.status(200).json({ success: true, message: "Veri alındı", data: receivedData });
  });
} catch (error) {
  console.log(error);
}

server.listen(port, () => {
  console.log("Server başlatıldı. Port:", port);
});
