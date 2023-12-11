const express = require("express");
var http = require("http");
const cors = require("cors");
const app = express();
const port = process.env.PORT ||3000;
var server = http.createServer(app);
var io = require("socket.io")(server,{
    cors:
    {
        origin:"*",
    }
});
//middlewre
app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
    console.log("connected");
    console.log(socket.id, "has joined");
    socket.on("/test", (msg) => {
        console.log(msg);
    });
});

server.listen(port, () => {
    console.log("server started on port", port);
});
