// const socket = io("https://gup-shup-app.vercel.app/");
const socket = io('https://gup-shup-server-production.up.railway.app/', {
  transports: ['websocket'], // Ensure you're using WebSocket transport
});

const form = document.querySelector("#send-container");
const messageInput = document.querySelector("#messageInp");
const messageContainer = document.querySelector(".container");

const audio = new Audio("sound/ding2-89720.mp3");

const append = function (message, position) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const message = messageInput.value;
  append(`You : ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});

const named = prompt("Enter your name to join");
socket.emit("new-user-joined", named);

socket.on("user-joined", (name) => {
  append(`${name} joined chat!`, "left");
});

socket.on("receive", (data) => {
  append(`${data.name} : ${data.message}`, "left");
});

socket.on("left", (name) => {
  append(`${name} : Left the Chat!`, "left");
});
