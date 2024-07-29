
const http = require('http');
const { Server } = require('socket.io');

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow requests from all origins
    methods: ["GET", "POST"],
    //credentials: true,
  }
});

const user = {};

io.on("connection", (socket) => {
  console.log("New user connected");

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
httpServer.listen(process.env.PORT || 8000);
