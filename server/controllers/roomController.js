const Room = require('../models/Room');
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
  } 
};
