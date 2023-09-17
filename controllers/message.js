import message from "../models/message.js";

//createMessage
//getMessage

export const createMessage = async (req, res) => {
    const {chatId, senderId, text} = req.body;
    const Message = new message({
        chatId, senderId, text
    });
    try {
        const response = await Message.save();
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const getMessages = async (req, res) => {
    const {chatId} = req.params;
    try {
        const Messages = await message.find({chatId})
        res.status(200).json(Messages);
    } catch (error) {
        console.log(error);
    }
}
