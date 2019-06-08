const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', () => {
  console.log('New WebSocket connection');
});

server.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});