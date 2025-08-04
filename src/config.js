const mongoose = require('mongoose');
 const  connect = mongoose.connect("mongodb://127.0.0.1:27017/myhasti")


const LoginSchema = new mongoose.Schema({
  name: String,
  password: String,
});

const Collection = mongoose.model('users', LoginSchema);

module.exports = Collection;
