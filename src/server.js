//imports
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";



dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI  =process.env.MONGO_URI;


mongoose.connect(MONGO_URI).then(()=>{
    console.log("DB connected");
    app.listen(PORT, ()=>console.log(`server is running on http://localhost:${PORT}`)
    )
}).catch(err=>console.error(err))