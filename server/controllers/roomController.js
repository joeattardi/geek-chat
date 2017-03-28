const Room = require('../models/Room');
const User = require('../models/User');
const authService = require('../authService');
const constants = require('../constants');

function handleError(error) {
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
  getRooms: async function getRooms(req, res) {
    try {
      const rooms = await Room.find({}, '_id name topic');
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
      handleError(error);
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
      handleError(error);
    }
  }
};
