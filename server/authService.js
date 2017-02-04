const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

exports.generateNewToken = function generateNewToken(userId) {
  const token = jwt.sign({
    sub: userId
  }, process.env.JWT_SECRET); 

  return token;
};

exports.validateToken = function validateToken(token, callback) {
  jwt.verify(token, process.env.JWT_SECRET, callback); 
}

exports.hashPassword = function hashPassword(password) {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(password, salt); 
}

exports.validatePassword = function validatePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}
