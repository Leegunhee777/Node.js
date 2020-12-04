const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
user_id: String,
user_name: String,
user_pw: String
});

module.exports = mongoose.model('Usertoken', userSchema);

