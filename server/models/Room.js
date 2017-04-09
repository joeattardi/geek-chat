const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  topic: {
    type: String,
    required: false
  },
  admins: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }
});

module.exports = mongoose.model('Room', roomSchema);
