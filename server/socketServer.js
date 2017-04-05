const Server = require('socket.io');
const _ = require('lodash');
const winston = require('winston');

const chatConstants = require('../shared/chatConstants');
const User = require('./models/User');
const authService = require('./authService');

let connectedUsers = [];
let io;

function getUserList() {
  return connectedUsers.map(userRecord => userRecord.user);
}

function getUserForSocket(socket) {
  const userRecord = _.find(connectedUsers, user => user.socket === socket);
  return userRecord ? userRecord.user : {};
}

exports.sendSystemMessage = function sendSystemMessage(message, roomId) {
  io.emit(chatConstants.SYSTEM_MESSAGE, message, roomId, new Date());
}

exports.updateRoom = function updateRoom(room) {
  io.emit(chatConstants.UPDATE_ROOM, room);
}

exports.init = function init(server) {
  io = new Server(server);
  io.on(chatConstants.CONNECTION, socket => {
    winston.info('New socket.io connection');
    delete io.sockets.connected[socket.id];

    socket.on(chatConstants.AUTHENTICATE, jwt => {
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

              user.rooms.forEach(room => {
                io.to(room).emit(chatConstants.SYSTEM_MESSAGE, `${user.fullName} connected`, room, new Date());
              });

              connectedUsers.push(userRecord);
              winston.info(`User ${user.fullName} authenticated, joining chat`);
              io.emit(chatConstants.USER_LIST, getUserList());
            }
          });
        }
      });
    });

    socket.on(chatConstants.DISCONNECT, () => {
      winston.info('socket.io disconnected');
      const user = getUserForSocket(socket);
      if (user) {
        user.rooms.forEach(room => {
          io.to(room).emit(chatConstants.SYSTEM_MESSAGE, `${user.fullName} disconnected`, room, new Date());
        });
      }
      connectedUsers = connectedUsers.filter(userRecord => userRecord.socket !== socket);
      io.emit(chatConstants.USER_LIST, getUserList());
    });

    socket.on(chatConstants.CHAT_MESSAGE_FROM_CLIENT, (message) => {
      io.to(message.room).emit(chatConstants.CHAT_MESSAGE_TO_CLIENT, getUserForSocket(socket), message.message, message.room, new Date());
    });

    socket.on(chatConstants.JOIN_ROOM, (roomId, silent) => {
      const user = getUserForSocket(socket);
      if (user && user.rooms) {
        if (!user.rooms.includes(roomId)) {
          winston.debug(`${user.fullName} joined room ${roomId}`);
          user.rooms.push(roomId);
        }
        socket.join(roomId);

        io.emit(chatConstants.USER_LIST, getUserList());

        if (!silent) {
          io.to(roomId).emit(chatConstants.SYSTEM_MESSAGE, `${user.fullName} joined the room`, roomId, new Date());
        }
      }
    });

    socket.on(chatConstants.LEAVE_ROOM, roomId => {
      const user = getUserForSocket(socket);
      if (user) {
        winston.debug(`${user.fullName} left room ${roomId}`);
        user.rooms = user.rooms.filter(room => room !== roomId);
        socket.leave(roomId);

        io.emit(chatConstants.USER_LIST, getUserList());
        io.to(roomId).emit(chatConstants.SYSTEM_MESSAGE, `${user.fullName} left the room`, roomId, new Date());
      }
    });
  });
};
