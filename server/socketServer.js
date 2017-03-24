const Server = require('socket.io');
const _ = require('lodash');
const winston = require('winston');

const User = require('./models/User');
const authService = require('./authService');

let connectedUsers = [];

function getUserList() {
  return connectedUsers.map(userRecord => userRecord.user);
}

function getUserForSocket(socket) {
  const userRecord = _.find(connectedUsers, user => user.socket === socket);
  return userRecord.user;
}

exports.init = function init(server) {
  const io = new Server(server);
  io.on('connection', socket => {
    winston.info('New socket.io connection');
    delete io.sockets.connected[socket.id];

    socket.on('authenticate', jwt => {
      authService.validateToken(jwt, (err, decoded) => {
        if (err) {
          winston.info('Socket authentication failed, closing connection');
          socket.disconnect();
        } else {
          User.findById(decoded.sub).then(user => {
            if (user) {
              io.sockets.connected[socket.id] = socket;
              const userRecord = {
                user: _.pick(user, ['username', 'fullName']),
                socket
              };
              userRecord.user.rooms = user.rooms.map(room => room.toHexString());
              connectedUsers.push(userRecord);
              winston.info(`User ${user.fullName} authenticated, joining chat`);
              io.emit('userList', getUserList());
            }
          });
        }
      });
    });

    socket.on('disconnect', () => {
      winston.info('socket.io disconnected');
      connectedUsers = connectedUsers.filter(userRecord => userRecord.socket !== socket);
      io.emit('userList', getUserList());
    });

    socket.on('chatMessage', (message) => {
      io.to(message.room).emit('newMessage', getUserForSocket(socket), message.message, message.room, new Date());
    });

    socket.on('joinRoom', roomId => {
      const user = getUserForSocket(socket);

      if (!user.rooms.includes(roomId)) {
        user.rooms.push(roomId);
      }
      console.log('User rooms:', user.rooms);
      socket.join(roomId);
    });
  });
};
