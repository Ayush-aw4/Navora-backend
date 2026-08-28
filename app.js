const express = require('express');
const app = express();
const path = require("path")

const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);

// CORS: allow specific origins for the Vercel frontend (or all in dev)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(s => s.trim())
  : ["*"];
const io = socketio(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST"] }
});

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

io.on("connection",function(socket){
    socket.on("send-location",function(data){
    io.emit("receive-location",{id:socket.id, ...data});
    })
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id);
    });
    console.log("connected");
});

app.get("/",function(req,res){
    res.render("index", {
        socketServerUrl: process.env.SOCKET_SERVER_URL || ""
    });
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Navora server listening on port ${PORT}`);
});