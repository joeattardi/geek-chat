const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const winston = require('winston');

const dbConnection = require('./dbConnection');
const socketServer = require('./socketServer');
const router = require('./router');

const port = process.env.PORT || 3000;

const app = express();

winston.level = 'debug';

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use('/', router);

const server = http.createServer(app);
server.listen(port, () => {
  console.log('#############################################');
  console.log('#             G E E K C H A T               #');
  console.log('#############################################');
  console.log(`GeekChat listening on port ${port} (http)`);
});

socketServer.init(server);
