const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const constants = require('./constants');

const SALT_ROUNDS = 10;

function getUserFromToken(token) {
  return new Promise((resolve, reject) => {
    validateToken(token, (error, decoded) => {
      if (error) {
        const rejectVal = new Error('Invalid token');
        rejectVal.code = constants.ERROR_INVALID_TOKEN;
        reject(rejectVal);
      } else {
        resolve(User.findById(decoded.sub)
          .populate({
            path: 'rooms',
            model: 'Room'
          }));
      }
    });
  });
}

function generateNewToken(userId) {
  const token = jwt.sign({
    sub: userId
  }, process.env.JWT_SECRET); 

  return token;
};

function validateToken(token, callback) {
  jwt.verify(token, process.env.JWT_SECRET, callback); 
}

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(password, salt); 
}

function validatePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

module.exports = {
  getUserFromToken,
  generateNewToken,
  validateToken,
  hashPassword,
  validatePassword
};
