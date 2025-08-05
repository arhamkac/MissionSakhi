import dotenv from "dotenv"
import {app} from "./app.js"
import {connectDB} from './db/index.js'

connectDB()
.then(
    app.listen(8000||process.env.PORT,()=>{
        console.log(`Server running on port ${process.env.PORT}`)
    })
)
.catch((err)=>{
    console.log("Mongo DB Connection failed ",err)
})