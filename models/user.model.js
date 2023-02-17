const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');

const schema = new mongoose.Schema({
    telegramId: String,
});

const User = mongoose.model('User', schema);

module.exports = User;