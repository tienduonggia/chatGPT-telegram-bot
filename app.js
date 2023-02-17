require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const ChatGPTService = require('./services/chatgpt.service');
const DbService = require('./services/db.service');
//Get TELEGRAM BOT KEY
const telegramToken = process.env.TELEGRAM_KEY;




DbService.connect().then(() => {
    
    //Create bot
    console.log("Starting bot...");
    const  CosmosRocketBot= new TelegramBot(telegramToken, {polling: true});
  
    CosmosRocketBot.on('message', async (msg) => {

        //Id user sent mess
        const authorId = msg.from.id;

        // ID current message
        const chatId = msg.chat.id;
    
        //Noi dung tin nhan
        const chatMess = msg.text;
        
        const user = await DbService.getUserByTelegramId(authorId);
        

       // CosmosRocketBot.sendMessage(chatId, chatMess);
       ChatGPTService.generateCompletion(chatMess, user).then(responseMsg => {
            CosmosRocketBot.sendMessage(chatId, responseMsg);
       });
    });

});





