const _ = require('lodash');
const request = require('request');

const User = require('../models/User');
const authService = require('../authService');
const constants = require('../constants');

module.exports = {
  getUser: async function getUser(req, res) {
    try {
      const user = await authService.getUserFromToken(req.get('authorization'));

      if (user) {
        res.status(200).json({
          result: constants.API_RESULT_SUCCESS,
          user: _.pick(user, ['_id', 'username', 'fullName', 'email', 'rooms'])
        });
      } else {
        return res.status(401).json({
          result: constants.API_RESULT_ERROR,
          result: 'Invalid user'
        });
      }
    } catch (error) {
      if (error.code === constants.ERROR_INVALID_TOKEN) {
        return res.status(401).json({
          result: constants.API_RESULT_ERROR,
          message: 'Invalid token'
        });
      } else {
        res.status(500).json({
          result: constants.API_RESULT_ERROR,
          code: constants.ERROR_GENERIC,
          message: `An unexpected error has occurred: ${error.message}`
        });
      }
    }
  },

  login: async function login(req, res) {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({
        result: constants.API_RESULT_ERROR,
        message: 'Username and password are required'
      });
    } else {
      try {
        const foundUser = await User.findOne({ username: req.body.username });
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
      } catch (error) {
        res.status(500).json({
          result: constants.API_RESULT_ERROR,
          code: constants.ERROR_GENERIC,
          message: `An unexpected error has occurred: ${error.message}`
        });
      }
    }
  },

  signup: async function signup(req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      fullName: req.body.name,
      email: req.body.email
    });

    try {
      const savedUser = await user.save();
      res.status(201).json({
        result: constants.API_RESULT_SUCCESS,
        token: authService.generateNewToken(savedUser._id)
      });
    } catch (error) {
      if (error.code === constants.MONGO_ERROR_DUPLICATE_KEY) {
        res.status(400).json({
          result: constants.API_RESULT_ERROR,
          code: constants.ERROR_USERNAME_EXISTS,
          message: 'That username is already taken.'
        });
      } else {
        res.status(500).json({
          result: constants.API_RESULT_ERROR,
          code: constants.ERROR_GENERIC,
          message: `An unexpected error has occurred: ${error.message}`
        });
      }
    }
  }
};
