const io = require('socket.io')();
const fs = require('fs');
const uuid = require('uuid/v4');

io.listen(5000);
console.log('💻 listening on 5000');

const roomDict ={};
let newestRoomID = 0;
let totalUserCount = 0;

function transformRoomDict() {
  const rooms = Object.keys(roomDict).map(d => {
    const userCount = Object.keys(roomDict[d].socketDict).length;
    return {
      ID: roomDict[d].ID,
      userCount
    }
  }).filter(d => d.userCount);

  return {
    rooms,
    totalUserCount
  };
}

var idDic ={}

io.on('connection', function (socket) {
  const socketID = uuid();
  totalUserCount++;
  idDic[socket.id] = true;

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
      });
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
    totalUserCount--;
    console.log(totalUserCount);
    if (room) {
      delete room.socketDict[socketID];
      io.emit('update', {
        type: 'dashboard',
        value: transformRoomDict()
      });
    } else {
      io.emit('update', {
        type: 'dashboard',
        value: {totalUserCount}
      });
    }
  });

  socket.on('message', function({message, userName}) {
    Object.keys(room.socketDict).forEach(d => {
      const text = `${userName ? userName : 'Anonymous'}: ${message ? message : ''}`
      room.socketDict[d].emit('message', text);
    });
  })
});
