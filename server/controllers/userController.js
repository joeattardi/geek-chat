const _ = require('lodash');

const User = require('../models/User');
const authService = require('../authService');
const constants = require('../constants');

module.exports = {
  getUser(req, res) {
    const token = req.get('authorization');

    authService.validateToken(token, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          result: constants.API_RESULT_ERROR,
          message: 'Invalid token'
        });
      }

      User.findById(decoded.sub).then(user => {
        if (user) {
          res.status(200).json({
            result: constants.API_RESULT_SUCCESS,
            user: _.pick(user, ['_id', 'username', 'fullName', 'email'])
          });
        } else {
          return res.status(401).json({
            result: constants.API_RESULT_ERROR,
            result: 'Invalid user'
          });
        }
      });
    });
  },
  
  login(req, res) {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({
        result: constants.API_RESULT_ERROR,
        message: 'Username and password are required'
      });
    } else {
      User.findOne({ username: req.body.username }).then(foundUser => {
        if (!foundUser || !authService.validatePassword(req.body.password, foundUser.password)) {
          res.status(401).json({
            result: constants.API_RESULT_ERROR,
            message: 'Invalid username or password'
          });
        } else {
          res.status(200).json({
            result: constants.API_RESULT_SUCCESS,
            token: authService.generateNewToken(foundUser._id)
          }); 
        }
      });
    }
  },

  signup(req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      fullName: req.body.name,
      email: req.body.email
    });

    user.save().then(savedUser => {
      res.status(201).json({
        result: constants.API_RESULT_SUCCESS,
        token: authService.generateNewToken(savedUser._id)
      });
    }).catch(error => {
      if (error.code === constants.MONGO_ERROR_DUPLICATE_KEY) {
        res.status(400).json({
          result: constants.API_RESULT_ERROR,
          code: constants.ERROR_USERNAME_EXISTS,
          message: 'That username is already taken.'
        }); 
      } else {
        console.log(error);
        res.status(500).json({
          result: constants.API_RESULT_ERROR,
          code: constants.ERROR_GENERIC,
          message: 'An unexpected error has occurred.'
        });
      }
    });
  }
};
