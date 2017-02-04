const Server = require('socket.io');
const _ = require('lodash');

const User = require('./models/User');
const authService = require('./authService');

let connectedUsers = [];

function getUserList() {
  return connectedUsers.map(userRecord => _.pick(userRecord.user, ['username', 'fullName'])); 
}

exports.init = function init(server) {
  const io = new Server(server);
  io.on('connection', socket => {
    delete io.sockets.connected[socket.id];

    socket.on('authenticate', jwt => {
      authService.validateToken(jwt, (err, decoded) => {
        if (err) {
          socket.disconnect();
        } else {
          User.findById(decoded.sub).then(user => {
            if (user) {
              io.sockets.connected[socket.id] = socket;
              connectedUsers.push({ user, socket });

              io.emit('userList', getUserList());
            }
          });
        }
      });
    });

    socket.on('disconnect', () => {
      connectedUsers = connectedUsers.filter(userRecord => userRecord.socket !== socket);
      io.emit('userList', getUserList());
    });

    socket.on('chatMessage', (message, room) => {
      io.emit('newMessage', message);
    });
  });
};
