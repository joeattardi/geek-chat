const http = require('http');
const Server = require('socket.io');
const express = require('express');

const port = 3000;

const app = express();

app.use(express.static('dist'));

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`GeekChat listening on port ${port} (http)`);
});

const io = new Server(server);
io.on('connection', socket => {
  console.log('New user connected');

  socket.on('chatMessage', (message, room) => {
    io.emit('newMessage', message);
  });
});

