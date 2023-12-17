import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try{
    const connectionIn = await mongoose.connect(`${process.env.MANGODB_URL}/${DB_NAME}`)
    console.log(`\n MAngo DB connected db host:${connectionIn.connection.host}`);
    }catch(error)
    {
        console.log("COnnection failed ",error);
        process.exit(1)
    }
}

export default connectDB;