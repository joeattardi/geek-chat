const winston = require('winston');

const Room = require('../models/Room');
const User = require('../models/User');
const authService = require('../authService');
const constants = require('../constants');
const socketServer = require('../socketServer');

function handleError(error, res) {
  winston.error(error);
  if (error.code === constants.ERROR_INVALID_TOKEN) {
    res.status(401).json({
      result: constants.API_RESULT_ERROR,
      message: 'Invalid token'
    });
  } else {
    res.status(500).json({
      result: constants.API_RESULT_ERROR,
      code: constants.ERROR_GENERIC,
      message: `An unexpected error has occurred: ${error.message}`
    });
  }
}

module.exports = {
  createRoom: async function createRoom(req, res) {
    try {
      const user = await authService.getUserFromToken(req.get('authorization'));
      if (!user) {
        return res.status(401).json({
          result: constants.API_RESULT_ERROR,
          message: 'Invalid user'
        });
      }

      const room = await Room.find({ name: req.body.name});
      if (room.length) {
        return res.status(400).json({
          result: constants.API_RESULT_ERROR,
          code: constants.ERROR_ROOM_EXISTS,
          message: `Room "${req.body.name}" already exists`
        });
      }

      const newRoom = new Room({
        name: req.body.name,
        topic: req.body.topic,
        admins: [user]
      });

      const savedRoom = await newRoom.save();
      user.rooms.push(savedRoom);
      await user.save();

      res.status(201).json({
        result: constants.API_RESULT_SUCCESS,
        message: `Room "${req.body.name}" has been created`,
        room: newRoom
      });

    } catch (error) {
      handleError(error, res);
    }
  },

  deleteRoom: async function deleteRoom(req, res) {
    try {
      const user = await authService.getUserFromToken(req.get('authorization'));
      if (!user) {
        return res.status(401).json({
          result: constants.API_RESULT_ERROR,
          message: 'Invalid user'
        });
      }

      const room = await Room.findById(req.params.roomId);
      if (!room) {
        return res.status(404).json({
          result: constants.API_RESULT_ERROR,
          message: 'Invalid room ID'
        });
      }

      const users = await User.find({ rooms: room._id })
        .populate({
          path: 'rooms',
          model: 'Room'
        });
      if (users) {
        users.forEach(async function (roomUser) {
          roomUser.rooms = roomUser.rooms.filter(r => !(r._id.equals(room._id)));
          await roomUser.save();
        });
      }

      await room.remove();

      socketServer.deleteRoom(room);

      res.status(200).json({
        result: constants.API_RESULT_SUCCESS,
        message: `Room "${room.name}" was deleted`
      });
    } catch (error) {
      handleError(error, res);
    }
  },

  updateRoom: async function updateRoom(req, res) {
    try {
      const user = await authService.getUserFromToken(req.get('authorization'));

      if (!user) {
        return res.status(401).json({
          result: constants.API_RESULT_ERROR,
          message: 'Invalid user'
        });
      }

      const room = await Room.findById(req.params.roomId);

      if (!room) {
        return res.status(404).json({
          result: constants.API_RESULT_ERROR,
          message: 'Invalid room ID'
        });
      }

      let changed;
      if (room.name !== req.body.name) {
        changed = 'name';
      } else if (room.topic !== req.body.topic) {
        changed = 'topic';
      }

      room.name = req.body.name;
      room.topic = req.body.topic;

      await room.save();

      res.status(200).json({
        result: constants.API_RESULT_SUCCESS,
        message: 'Room updated'
      });

      if (changed === 'name') {
        socketServer.sendSystemMessage(`${user.fullName} renamed the room to "${room.name}"`, room._id);
      } else if (changed === 'topic') {
        socketServer.sendSystemMessage(`${user.fullName} changed the topic to "${room.topic}"`, room._id);
      }

      socketServer.updateRoom(room);

    } catch (error) {
      handleError(error, res);
    }
  },

  getRooms: async function getRooms(req, res) {
    try {
      const rooms = await Room.find({}, '_id name topic admins');
      res.status(200).json({
        result: constants.API_RESULT_SUCCESS,
        rooms
      });
    } catch (error) {
      res.status(500).json({
        result: constants.API_RESULT_ERROR,
        code: constants.ERROR_GENERIC,
        message: error.message
      });
    }
  },

  leaveRoom: async function leaveRoom(req, res) {
    try {
      const user = await authService.getUserFromToken(req.get('authorization'));
      if (user) {
        const room = await Room.findById(req.params.roomId);
        if (room) {
          if (user.rooms.find(userRoom => userRoom._id.toHexString() === req.params.roomId)) {
            user.rooms = user.rooms.filter(userRoom => userRoom._id.toHexString() !== req.params.roomId);
            await user.save();
            return res.status(200).json({
              result: constants.API_RESULT_SUCCESS,
              message: `Left room "${room.name}"`
            });
          } else {
            return res.status(400).json({
              result: constants.API_RESULT_ERROR,
              message: `You are not in the room "${room.name}".`
            });
          }
        } else {
          return res.status(404).json({
            result: constants.API_RESULT_ERROR,
            message: 'Invalid room ID'
          });
        }
      } else {
        return res.status(401).json({
          result: constants.API_RESULT_ERROR,
          message: 'Invalid user'
        });
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  joinRoom: async function joinRoom(req, res) {
    try {
      const user = await authService.getUserFromToken(req.get('authorization'), true);
      if (user) {
        const room = await Room.findById(req.params.roomId);
        if (room) {
          user.rooms.push(room);
          await user.save();
          res.status(200).json({
            result: constants.API_RESULT_SUCCESS,
            message: `Joined room "${room.name}"`
          });
        } else {
          return res.status(404).json({
            result: constants.API_RESULT_ERROR,
            message: 'Invalid room ID'
          });
        }
      } else {
        return res.status(401).json({
          result: constants.API_RESULT_ERROR,
          message: 'Invalid user'
        });
      }
    } catch (error) {
      handleError(error, res);
    }
  }
};
