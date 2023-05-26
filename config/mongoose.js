// Require Mongoose and Environment config
const mongoose = require('mongoose');
const env = require('./environment');

// Setup Mongoose Connection
mongoose.connect(`mongodb://127.0.0.1/${env.db}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error Connecting to MongoDB"));

db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = db;