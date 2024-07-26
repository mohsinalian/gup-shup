const { Server } = require("socket.io");
const { createServer } = require("http");

const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket.IO server");
});
const io = new Server(httpServer);

const user = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    user[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: user[socket.id],
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("left", user[socket.id]);
    delete user[socket.id];
  });
});

// Vercel's function export
module.exports = (req, res) => {
  httpServer.emit("request", req, res);
};
