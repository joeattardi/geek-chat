const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const dbConnection = require('./dbConnection');
const socketServer = require('./socketServer');
const router = require('./router');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use('/', router);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`GeekChat listening on port ${port} (http)`);
});

socketServer.init(server);

