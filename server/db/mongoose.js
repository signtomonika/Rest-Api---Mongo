const mongoose = require('mongoose');

mongoose.Promise = global.Promise;  //config mongoose to use the Promises in node and not other 3rd party promises

//mongoose.connect(process.env.MONGODB_URI);  //herokumongolab addon lives in the process.env

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {

    mongoose

};