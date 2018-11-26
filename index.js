const express = require("express"),
  http = require("http"),
  app = express(),
  server = http.createServer(app),
  io = require("socket.io")(server);

var users = [];
app.use(express.static(__dirname + '/public'));


app.get("/", (req, res) => {

  res.sendFile(__dirname + "/public");
});

io.on("connection", socket => {
  console.log("user connected " + socket.id);

  socket.on("disconnect", function () {
    console.log("user disconnected " + socket.id);
    users.splice(users.indexOf(socket.username), 1);
    UpdateUserName();
  });

  socket.on("new_user", function (data) {
    console.log(data.name);
    socket.username = data.name;

    for (var i = 0; i < users.length; i++) {
      if (users[i].name.localeCompare(data.name)) {
        users.splice(i, 1);
      }
    }
    // if (users.find(data.name)) {
    //   users.splice(users.indexOf(data.name), 1);
    // }
    users.push(data);
    UpdateUserName();
  });

  function UpdateUserName() {
    io.sockets.emit("get users", users);
  }
});



var port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Node app is running on port 3000");
});
