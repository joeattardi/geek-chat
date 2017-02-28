const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  topic: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Room', roomSchema);

