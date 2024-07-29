const http = require("http");

// https.get("", (req, res) => {
//   res.send("hello");
// });

const port = process.env.PORT || 8000 || http;
// const port = http;
const io = require("socket.io")(port, {
  cors: {
    origin: "*", // Allow requests from all origins
  },
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
