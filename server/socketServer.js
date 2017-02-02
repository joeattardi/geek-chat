const Server = require('socket.io');
const authService = require('./authService');

exports.init = function init(server) {
  const io = new Server(server);
  io.on('connection', socket => {
    delete io.sockets.connected[socket.id];

    socket.on('authenticate', jwt => {
      authService.validateToken(jwt, (err, decoded) => {
        if (err) {
          socket.disconnect();
        } else {
          io.sockets.connected[socket.id] = socket;
        }
      });
    });

    socket.on('chatMessage', (message, room) => {
      io.emit('newMessage', message);
    });
  });
};
