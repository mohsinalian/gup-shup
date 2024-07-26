const { Server } = require("socket.io");
const { createServer } = require("http");

const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket.IO server is running");
});

const io = new Server(httpServer);

const user = {};

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("new-user-joined", (name) => {
    user[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
    console.log(`${name} has joined`);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: user[socket.id],
    });
  });

  socket.on("disconnect", () => {
    console.log(`User ${user[socket.id]} disconnected`);
    socket.broadcast.emit("left", user[socket.id]);
    delete user[socket.id];
  });
});

// Log message to indicate the server setup
console.log("Server setup completed, ready to handle requests.");

// Vercel's function export
module.exports = (req, res) => {
  httpServer.emit("request", req, res);
};
module.exports = (req, res) => {
  res.status(200).send('Hello, world!');
};

