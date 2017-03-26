const express = require('express');

const userController = require('./controllers/userController');
const roomController = require('./controllers/roomController');

const router = express.Router();

router.get('/user', userController.getUser);
router.post('/login', userController.login);
router.post('/signup', userController.signup);

router.get('/rooms', roomController.getRooms);
router.post('/join/:roomId', roomController.joinRoom);
router.post('/leave/:roomId', roomController.leaveRoom);

module.exports = router;
