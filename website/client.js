// const socket = io("https://gup-shup-app.vercel.app/");
const socket = io("https://gup-shup-server-production.up.railway.app/", {
  transports: ["websocket"], // Ensure you're using WebSocket transport
});

const form = document.querySelector("#send-container");
const messageInput = document.querySelector("#messageInp");
const messageContainer = document.querySelector(".container");
messageInput.focus();

const audio = new Audio("sound/ding2-89720.mp3");

const append = function (name, message, position) {
  //create elements
  const messageElement = document.createElement("div");
  const userName = document.createElement("p");
  const messageText = document.createElement("p");
  // Assigning Values
  userName.innerText = name;
  messageText.innerText = message;
  //  assigning classes
  messageElement.classList.add("messageBox");
  messageElement.classList.add(position);
  userName.classList.add("name");
  messageText.classList.add("message");
  // Adding Elments to dome
  messageElement.append(userName);
  messageElement.append(messageText);
  messageContainer.append(messageElement);
  // check
  if (position == "left") {
    audio.play();
  }
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const message = messageInput.value;
  append("", message, "right");
  socket.emit("send", message);
  messageInput.value = "";
});

const named = prompt("Enter your name to join");
socket.emit("new-user-joined", named);

socket.on("user-joined", (name) => {
  append(name, "Joined chat!", "left");
});

socket.on("receive", (data) => {
  append(data.name, data.message, "left");
});

socket.on("left", (name) => {
  append(name, "Left the Chat!", "left");
});
