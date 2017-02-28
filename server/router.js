const express = require('express');

const userController = require('./controllers/userController');
const roomController = require('./controllers/roomController');

const router = express.Router();

router.get('/user', userController.getUser);
router.post('/login', userController.login);
router.post('/signup', userController.signup);

router.get('/rooms', roomController.getRooms);

module.exports = router;
