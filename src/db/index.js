import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
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

const deleteVideoById = async (videoId) =>{

    try {

     const result = await Video.deleteOne({ _id: videoId })
  if (result?.deletedCount == 1) {
      console.log('Video deleted successfully');
    //   console.log(result)
      return result
} else {
    return null;
}
}catch(error)
{
        console.log('Error deleting video',error.message);
        return null;
    } 
  }

  const deleteSubscriberById = async (subcriptionId) =>{

    try {

     const result = await Subscription.deleteOne({ _id: subcriptionId })
  if (result?.deletedCount == 1) {
      console.log('Subscription deleted successfully');
    //   console.log(result)
      return result
} else {
    return null;
}
}catch(error)
{
        console.log('Error deleting ',error.message);
        return null;
    } 
  }

export default connectDB;
export {deleteVideoById}
export {deleteSubscriberById}