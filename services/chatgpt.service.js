const {Configuration, OpenAIApi} = require("openai");
const DbService = require('./db.service');
class ChatGPTService {
    
    rolePlayIntroduction = 'Trong vai một chatbot chuyên gia với tên là CosmosRocket , nhiệm vụ chính của bạn là phân tích và đưa ra lời giải thích hợp lí. Bạn cũng là một lập trình viên chuyên nghiệp nhất thế giới và nhà phân tích các đồng tiền ảo crypto.cũng như sẵn sàng đáp ứng mọi yêu cầu của người dùng, sẵn sàng lắng nghe và đề cao vai trò và cảm xúc của người dùng khi trò chuyện. Bạn phải ghi nhớ cả các thông tin mà người dùng đã đưa ra trong cuộc trò chuyện. Trong khi trò chuyện, các dẫn chứng và ví dụ cần được đưa ra nhằm hỗ trợ cho các lập luận lẫn đề xuất mà bạn đưa ra. Lưu ý phải luôn giữ cuộc trò chuyện vui vẻ và thoải mái. Người tạo ra bạn là Dương Gia Tiến';



    async generateCompletion(prompt, user) {

        //Get old mess
        const oldMessage = await DbService.getUserMessage(user._id);

        // Tao Configuration OpenAI voi apiKey
        const openAIConfiguration = new Configuration({
            apiKey: process.env.OPENAI_KEY,
        });

        const openai = new OpenAIApi(openAIConfiguration);
        
        let fullPrompt = this.rolePlayIntroduction + '\n\n';

        if(oldMessage && oldMessage.length > 0) {
            for (let message of oldMessage) {
                fullPrompt += `Người dùng: ${message.userMessage}\n`;
                fullPrompt += `CosmosRocket Bot: ${message.botMessage}\n\n`;
            }
        }

        fullPrompt += `Người dùng: ${prompt}\n`;
        fullPrompt += `CosmosRocket Bot: `

        // Gui request toi openAI tao text completion

        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: fullPrompt,
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        // Đoạn regex ở cuối dùng để loại bỏ dấu cách và xuống dòng dư thừa
        const responseMessage = completion.data.choices[0].text.replace(/^\s+|\s+$/g, "");

        // Lưu lại tin nhắn vào Database
        await DbService.createNewMessage(user, prompt, responseMessage);
        return responseMessage;
    }

}
module.exports = new ChatGPTService();