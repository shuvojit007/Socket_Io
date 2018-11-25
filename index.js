const express = require("express"),
  http = require("http"),
  app = express(),
  server = http.createServer(app),
  io = require("socket.io")(server);

var users = [];
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
  console.log("user connected " + socket.id);

  socket.on("disconnect", function() {
    console.log("user disconnected " + socket.id);
    users.splice(users.indexOf(socket.username), 1);
    UpdateUserName();
  });

  socket.on("new_user", function(data) {
    console.log(data);
    socket.username = data;
    users.push(socket.username);
    UpdateUserName();
  });

  function UpdateUserName() {
    io.sockets.emit("get users", users);
  }
});

server.listen(3000, () => {
  console.log("Node app is running on port 3000");
});
