import chat from "../models/chat.js";
// createChat
// findtUserChats
// findChat

export const createChat = async (req, res) => {
    const {firstId, secondId} = req.body;
    try {
        const Chat = await chat.findOne({
            members: {$all: [firstId, secondId]}
        });
        if (Chat)
            return res.status(200).json(Chat);
        const newChat = new chat({
            members: [firstId, secondId]
        });
        const response = await newChat.save();
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const findUserChats = async (req, res) => {
    const userId = req.params.userId;
    try {
        const chats = await chat.find({
            members: {$in: [userId]}
        });
        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const findChat = async (req, res) => {
    const {firstId, secondId} = req.params;
    try {
        const chats = await chat.findOne({
            members: {$all: [firstId, secondId]}
        });
        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}