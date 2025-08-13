import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();

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

app.use("/api/users",userRouter)
app.use("/api/posts",postRouter)
app.use("/api/vote",voteRouter)
app.use("/api/comment",commentRouter)

export {app}