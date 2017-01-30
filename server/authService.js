const jwt = require('jsonwebtoken');

exports.generateNewToken = function generateNewToken(userId) {
  const token = jwt.sign({
    sub: userId
  }, process.env.JWT_SECRET); 

  return token;
};
