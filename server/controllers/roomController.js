const Room = require('../models/Room');
const User = require('../models/User');
const authService = require('../authService');
const constants = require('../constants');

module.exports = {
  getRooms: function getRooms(req, res) {
    Room.find({}, '_id name topic')
      .then(rooms => {
        res.status(200).json({
          result: constants.API_RESULT_SUCCESS,
          rooms
        });
      }).catch(error => {
        res.status(500).json({
          result: constants.API_RESULT_ERROR,
          code: constants.ERROR_GENERIC,
          message: error.message
        });
      });
  },

  joinRoom: function joinRoom(req, res) {
    const token = req.get('authorization');

    authService.validateToken(token, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          result: constants.API_RESULT_ERROR,
          message: 'Invalid token'
        });
      }

      User.findById(decoded.sub)
        .populate({
          path: 'rooms',
          model: 'Room'
        }).then(user => {
          if (user) {
            Room.findById(req.params.roomId).then(room => {
              if (room) {
                user.rooms.push(room);
                user.save().then(savedUser => {
                  res.status(200).json({
                    result: constants.API_RESULT_SUCCESS,
                    message: `Joined room "${room.name}"`
                  });
                }).catch(error => {
                  res.status(500).json({
                    result: constants.API_RESULT_ERROR,
                    code: constants.ERROR_GENERIC,
                    message: error.message
                  });
                });
              } else {
                return res.status(404).json({
                  result: constants.API_RESULT_ERROR,
                  result: 'Invalid room ID'
                });
              }
            });
          } else {
            return res.status(401).json({
              result: constants.API_RESULT_ERROR,
              result: 'Invalid user'
            });
          }
        });
    });
  }
};
