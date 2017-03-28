const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  rooms: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Room',
    default: []
  }
});

userSchema.pre('save', function (next) { 
  const authService = require('../authService');
  if (this.isModified('password')) {
    this.password = authService.hashPassword(this.password);
    next();
  } else {
    next();
  }
});

module.exports = mongoose.model('User', userSchema);
