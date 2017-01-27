const http = require('http');

const express = require('express');

const port = 3000;

const app = express();

app.use(express.static('dist'));

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`GeekChat listening on port ${port} (http)`);
});

