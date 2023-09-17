import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/user.js'
import chatRoutes from './routes/chat.js'
import messageRoutes from './routes/message.js'
import {Server} from 'socket.io'

const io = new Server({cors: "http://localhost:5173"});


const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes)

app.get('/', (req, res) => {
    res.send("Welcome to my chat app api");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
    console.log(`Server running one port: ${PORT}`)
});

const DATABASE_URL = process.env.CONNECTION_URL;

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log(`MongoDB Connection established`))
    .catch((err) => console.log(err.message));

//socket creation
let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("new connection", socket.id);
    //listen to a connection
    socket.on("addNewUser", (userId) => {
        !onlineUsers.some(user => user.userId === userId) &&
        onlineUsers.push({
            userId,
            socketId: socket.id,
        });
        console.log("onlineUsers",onlineUsers);
        io.emit("getOnlineUsers", onlineUsers);
    });
    //add message
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find((user) => user.userId === message.recipientId);
        if (user) {
            io.to(user.socketId).emit("getMessage", message);
            io.to(user.socketId).emit("getNotifications", {
                senderId: message.senderId,
                isRead: false,
                date: new Date(),
            })
        }
    });
    
    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
});


io.listen(4000);