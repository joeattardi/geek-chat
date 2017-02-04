const mongoose = require('mongoose');

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


