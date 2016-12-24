import socketIO from 'socket.io-client'
const io = socketIO('localhost:5000');

export default io;
