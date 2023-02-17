const mongoose = require('mongoose');
const User = require('../models/user.model');
const Message = require('../models/message.model');

class DbService {
    connection;
    async connect() {
        console.log('DB connecting...');
        mongoose.set('strictQuery', true);
        this.connection = await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connected');
    }

    async getUserByTelegramId(telegramId) {
        // tim ko co se tao moi
        let user = await User.findOne({
            telegramId,
        });
        if(!user) {
            user = await User.create({telegramId});
        }
        return user;
    }

    async getUserMessage(userId) {
        return Message.find({
            user: userId,
        });
    }

    async createNewMessage(user, userMessage, botMessage) {
        return Message.create({
            user: user._id,
            userMessage,
            botMessage,
        });
    }
    async clearUserMessages(userId) {
        // Xoá các tin nhắn của người dùng trong Database
        return Message.deleteMany({
          user: userId
        });
    }
}

module.exports = new DbService();