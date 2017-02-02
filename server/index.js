const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authService = require('./authService');
const socketServer = require('./socketServer');
const User = require('./models/User');

const port = 3000;

const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`GeekChat listening on port ${port} (http)`);
});

socketServer.init(server);

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

app.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      result: 'error',
      message: 'Username and password are required'
    });
  } else {
    User.findOne({ username: req.body.username }).then(foundUser => {
      if (!foundUser || !authService.validatePassword(req.body.password, foundUser.password)) {
        res.status(401).json({
          result: 'error',
          message: 'Invalid username or password'
        });
      } else {
        res.status(200).json({
          result: 'success',
          token: authService.generateNewToken(foundUser._id)
        }); 
      }
    });
  }
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


