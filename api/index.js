var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(5000);
console.log('💻 listening on 5000');

var roomDict ={};
var newestRoomID = undefined;

function transformRoomDict() {
  return Object.keys(roomDict).map(d => roomDict[d])
}

io.on('connection', function (socket) {
  console.log('a user connected...');

  var room;
  socket.on('room', function(data) {
    if (data.type === 'create') {
      if (newestRoomID === undefined) {
        newestRoomID = 0;
      }
      room = {
        ID: ++newestRoomID,
        userCount: 1
      }
      roomDict[newestRoomID] = room;
      io.emit('update', {
        type: 'dashboard',
        value: transformRoomDict()
      })
    }

    if (data.type === 'enter') {
      roomDict[data.ID].userCount ++;

      io.emit('update', {
        type: 'dashboard',
        value: transformRoomDict()
      })
    }
  });

  socket.on('fetchData', function(data) {
    if (data.type === 'dashboard') {
      io.emit('data', {
        type: 'dashboard',
        value: transformRoomDict()
      })
    }
  });
});
