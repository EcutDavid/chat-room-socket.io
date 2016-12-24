const app = require('http').createServer();
const io = require('socket.io')(app);
const fs = require('fs');
const uuid = require('uuid/v4');

app.listen(5000);
console.log('💻 listening on 5000');

const roomDict ={};
let newestRoomID = 0;

function transformRoomDict() {
  return Object.keys(roomDict).map(d => ({
    ID: roomDict[d].ID,
    userCount: Object.keys(roomDict[d].socketDict).length
  })).filter(d => d.userCount);
}

io.on('connection', function (socket) {
  const socketID = uuid();

  let room;
  socket.on('room', function(data) {
    if (data.type === 'create') {
      room = {
        ID: ++newestRoomID,
        socketDict: {[socketID]: socket}
      }
      roomDict[newestRoomID] = room;
      io.emit('update', {
        type: 'dashboard',
        value: transformRoomDict()
      })
    }

    if (data.type === 'enter') {
      room = roomDict[data.ID];
      room.socketDict[socketID] = socket;

      io.emit('update', {
        type: 'dashboard',
        value: transformRoomDict()
      });
    }
  });

  socket.on('fetchData', function(data) {
    if (data.type === 'dashboard') {
      io.emit('data', {
        type: 'dashboard',
        value: transformRoomDict()
      });
    }
  });

  socket.on('disconnect', function() {
    if (room) {
      delete room.socketDict[socketID];
      io.emit('update', {
        type: 'dashboard',
        value: transformRoomDict()
      });
    }
  });
});
