const express = require("express")
const connectDB = require("./config/db")
const cors = require("cors")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")

const { notFound, errorHandler, encryptData } = require("./middleware/errorMiddleware")
const { encryptResponse } = require("./middleware/authmiddleware")

require("dotenv").config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(encryptResponse);

const PORT = process.env.PORT

app.use('/user',userRoutes)
app.use("/chat",chatRoutes)
app.use("/message", messageRoutes)

app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT,async()=>{
    await connectDB()
    console.log(`Server Started ${PORT}`)
})

const io =require('socket.io')(server,{
    pingInterval: 40000, // Send ping every 5 seconds
    pingTimeout: 60000,
    cors : {
        origin : "http://localhost:3000"
    }
})

io.on("connection", (socket)=>{
    console.log("connected to socket.io")
    socket.on('setup', (userData)=>{
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User Joined Room: "+ room)
    });

    socket.on("typing", (room)=>socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if(!chat.users){
            return console.log("chat users not defined")
        }

        chat.users.forEach(user=>{
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message received", newMessageRecieved);
        })
    });

    socket.on('ping', () => {
        // Respond with pong event to acknowledge ping
        socket.emit('pong');
    });

    socket.on('disconnect', (reason) => {
        console.error('Disconnected from server:', reason);
        // Handle disconnection (e.g., retry connecting or notify the user)
    });

    socket.off("setup", ()=>{
        console.log("User Disconnected");
        socket.leave(userData._id)
    })
});