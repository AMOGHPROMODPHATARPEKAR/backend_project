import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
 

 export const verifyJWT = asyncHandler(async(req, _,next)=>{
   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
    if(!token)
    {
     throw new ApiError(401,"Unauthorized request")
    }
 
   const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
  const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
   if(!user)
   {
     throw new ApiError(401,"Invalid Access token")
   }
 
   req.user = user
   next()
   } catch (error) {
    throw new ApiError(401,"Invalid Access token")
   }
 })

 export const fetchVideoFromDatabase = async (req, res, next) => {
  try {
    // Fetch video from the database using req.params.id or any other method
    const video = await Video.findById(req.params.num);

    // Set the video object in req.video
    req.video = video;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error fetching video:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}