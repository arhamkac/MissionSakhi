import "dotenv/config";
import { app, server } from "./app.js";
import { connectDB } from './db/index.js';

const PORT = process.env.PORT || 8080;

connectDB()
.then(() => {
    server.listen(process.env.PORT || 8000, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("Mongo DB Connection failed ", err);
});