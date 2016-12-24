var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(5000);
console.log('💻 listening on 5000');

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
