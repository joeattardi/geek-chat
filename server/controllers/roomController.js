const Room = require('../models/Room');
const User = require('../models/User');
const authService = require('../authService');
const constants = require('../constants');

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
    const token = req.get('authorization');

    authService.validateToken(token, async function (err, decoded) {
      if (err) {
        return res.status(401).json({
          result: constants.API_RESULT_ERROR,
          message: 'Invalid token'
        });
      }

      try {
        const user = await User.findById(decoded.sub);
        if (user) {
          const room = await Room.findById(req.params.roomId);
          if (room) {
            if (user.rooms.find(userRoom => userRoom.toHexString() === req.params.roomId)) {
              user.rooms = user.rooms.filter(userRoom => userRoom.toHexString() !== req.params.roomId);
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
        return res.status(500).json({
          result: constants.API_RESULT_ERROR,
          code: constants.ERROR_GENERIC,
          message: error.message
        });
      }
    });
  },

  joinRoom: async function joinRoom(req, res) {
    const token = req.get('authorization');

    authService.validateToken(token, async function (err, decoded) {
      if (err) {
        return res.status(401).json({
          result: constants.API_RESULT_ERROR,
          message: 'Invalid token'
        });
      }

      try {
        const user = await User.findById(decoded.sub)
          .populate({
            path: 'rooms',
            model: 'Room'
          });

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
        res.status(500).json({
          result: constants.API_RESULT_ERROR,
          code: constants.ERROR_GENERIC,
          message: error.message
        });
      }
    });
  }
};
