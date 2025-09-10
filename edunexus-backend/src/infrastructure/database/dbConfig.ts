import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log(" MongoDB connected !!!");
    } catch (error) { 
        console.error("MongoDB not connected ther is some error :",error);
        process.exit(1);
    }
}