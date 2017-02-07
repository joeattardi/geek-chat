const mongoose = require('mongoose');
const winston = require('winston');

mongoose.Promise = global.Promise;
if (!process.env.MONGODB_URI) {
  console.error('Unable to start: No MONGODB_URI was specified');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    winston.info('Connected to MongoDB'); 
  })
  .catch(error => {
    winston.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  });


