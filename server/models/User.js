const mongoose = require('mongoose');
const authService = require('../authService');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
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
  }
});

userSchema.pre('save', function (next) { 
  if (this.isModified('password')) {
    this.password = authService.hashPassword(this.password);
    next();
  } else {
    next();
  }
});

module.exports = mongoose.model('User', userSchema);
