import express, { response, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";
import fetch from "node-fetch";

const app=express();
const server=createServer(app);
const io=new Server(server);
const apiKey=process.env.PERSPECTIVE_API_KEY;

export async function checkPost(text){
    const response=await fetch(
    `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${apiKey}`,
    {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            comment:{text},
            languages:['en'],
            requestedAttributes: {
            TOXICITY: {},
            SEXUALLY_EXPLICIT: {},
            THREAT: {},
            INSULT: {},
            PROFANITY: {}
        }
        })
    })

        const result=await response.json();
        return result.attributeScores;
}

io.on("connection",(socket)=>{
    console.log(`user connected with user ID:${socket.id}`)
    socket.on('join room',(roomId)=>{
        socket.join(roomId)
        console.log(`User ${socket.id} joined room ${roomId}`)
    })

socket.on('room message',async(messageData)=>{
    try {
        const scores = await checkPost(messageData.text); 
        const thresholds = {
            TOXICITY: 0.6,
            SEXUALLY_EXPLICIT: 0.5,
            THREAT: 0.5,
            INSULT: 0.5,
            PROFANITY: 0.5
        }
        for (let attr in thresholds) {
            if (scores[attr]?.summaryScore?.value > thresholds[attr]) {
                socket.emit('message rejected', {
                    reason: `Message contains unsafe content: ${attr}`
                });
                return;
            }
        }
        const newMessage=new Message({
            group:messageData.roomId,
            sender:messageData.senderId,
            content:messageData.text
        })
        await newMessage.save();
        io.to(messageData.roomId).emit('room message', newMessage)
        console.log(`Message saved and broadcasted to ${messageData.roomId}`)

    } catch (error) {
        console.log("Error on saving message ",error)
    }
})

socket.on('disconnect',()=>{
    console.log(`User disconnected with ID: ${socket.id}`);
})

})

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(cookieParser())
app.use(express.json({limit:"100kb"}))
app.use(express.static("public"))
app.use(express.urlencoded({extended:true, limit:"100kb"}))

import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import voteRouter from "./routes/vote.routes.js"
import commentRouter from "./routes/comment.routes.js"
import roomRouter from "./routes/room.routes.js"
import messageRouter from "./routes/message.routes.js"
import reportRouter from "./routes/report.routes.js"
import chatbotRouter from "./chatbot/server.js"
import { group } from "node:console";

app.use("/api/users",userRouter)
app.use("/api/posts",postRouter)
app.use("/api/vote",voteRouter)
app.use("/api/comment",commentRouter)
app.use("/api/rooms",roomRouter)
app.use("/api/messages",messageRouter)
app.use("/api/report",reportRouter)
app.use("/api/chatbot",chatbotRouter)

export {app}