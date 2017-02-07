const Server = require('socket.io');
const _ = require('lodash');
const winston = require('winston');

const User = require('./models/User');
const authService = require('./authService');

let connectedUsers = [];

function getUserList() {
  return connectedUsers.map(userRecord => _.pick(userRecord.user, ['username', 'fullName'])); 
}

function getUserForSocket(socket) {
  const userRecord = _.find(connectedUsers, user => user.socket === socket);
  return _.pick(userRecord.user, ['username', 'fullName']);
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
              connectedUsers.push({ user, socket });

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

    socket.on('chatMessage', (text) => {
      io.emit('newMessage', getUserForSocket(socket), text, new Date());
    });
  });
};
