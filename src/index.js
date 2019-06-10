const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('join', ({ username, room }) => {
    socket.join(room);

    socket.emit('message', generateMessage('Welcome'));
    socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined.`));
  })

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed.');
    }

    io.to('San Diego').emit('message', generateMessage(message));
    callback();
  })

  socket.on('sendLocation', (location, callback) => {
    io.emit('locationMessage', generateLocationMessage(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`));
    callback();
  })

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left'));
  })
});

server.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});