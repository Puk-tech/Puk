const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

let players = {};

io.on("connection", (socket) => {
  if (Object.keys(players).length >= 4) {
    socket.emit("full");
    return;
  }

  players[socket.id] = { x: 400, y: 300, emoji: "", id: socket.id };
  io.emit("players", players);

  socket.on("move", (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
    }
    io.emit("players", players);
  });

  socket.on("emoji", (emoji) => {
    if (players[socket.id]) {
      players[socket.id].emoji = emoji;
    }
    io.emit("players", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("players", players);
  });
});

app.use(express.static("public"));
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));