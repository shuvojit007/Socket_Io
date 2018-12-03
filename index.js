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

  // socket.on("disconnect", function () {
  //   users.splice(users.indexOf(socket.userid), 1);
  //   UpdateUserName();
  // });


  socket.on("remove_user", function (data) {
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === data.id) {
        users.splice(i, 1);
      }
    }
    //  users.splice(users.indexOf(data.id), 1);
    UpdateUser();
  });

  socket.io("website", function (data) {
    UpdateUser();
  });

  socket.on("new_user", function (data) {
    console.log(data);
    socket.username = data.name;
    socket.userid = data.id;
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === data.id) {
        users.splice(i, 1);
      }
    }
    users.push(data);
    UpdateUser();
  });

  function UpdateUser() {
    io.sockets.emit("get users", users);
  }
});



var port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Node app is running on port 3000");
});
