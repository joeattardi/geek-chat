const http = require('http');
const Server = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authService = require('./authService');
const User = require('./models/User');

const port = 3000;

const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`GeekChat listening on port ${port} (http)`);
});

mongoose.Promise = global.Promise;
if (!process.env.MONGODB_URI) {
  console.error('Unable to start: No MONGODB_URI was specified');
  process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI)
  .catch(error => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  });

app.post('/signup', (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    fullName: req.body.name,
    email: req.body.email
  });

  user.save().then(savedUser => {
    res.status(201).json({
      result: 'success',
      token: authService.generateNewToken(savedUser._id)
    });
  });
});

const io = new Server(server);
io.on('connection', socket => {
  console.log('New user connected');

  socket.on('chatMessage', (message, room) => {
    io.emit('newMessage', message);
  });
});

