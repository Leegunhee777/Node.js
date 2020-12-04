const mongoose = require('mongoose');
const userSchema2 = new mongoose.Schema({
user_id: String,
content: String,
created_at : {type: Date,'default':Date.now},
});

module.exports = mongoose.model('todo', userSchema2);

