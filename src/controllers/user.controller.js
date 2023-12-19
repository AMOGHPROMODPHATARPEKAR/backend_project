import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/Apiresponse.js";


const registerUser = asyncHandler(async (req,res)=>{
   //get user details from frontend
   const {username, email,fullname ,password} = req.body
//    console.log("email:",email);

   //validation
   if(
    [fullname,email,username,password].some((field)=>{
        field?.trim() === ""
    })
   ){
   throw new ApiError(404,"All fields are required")
   }

   //check if user already exit
   const existedUser = await User.findOne({
    $or: [{email}, {username}]
   }
   )
   if(existedUser)
   {
    throw new ApiError(409,"User with same email or username already exists")
   }

   //check images check for avatar
   const avatarLocalPath = req.files?.avatar[0]?.path
   
//    const coverImageLocalPath= req.files?.coverImage[0]?.path

let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
}

   if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
   }

   //upload to cloudinary
   
  const avatar =  await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar)
  {
    throw new ApiError(400,"Avatar file is required")
  }
  
   //create user object- create entry in db
  const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
   })

   //check for user creation
   const createdUser = await User.findById(user._id).select("-password -refreshToken")

   if(!createdUser)
   {
    throw new ApiError(500,"Something went wrong while reistering user")
   }
   
   //return res

   return res.status(201).json(
    new ApiResponse(200,createdUser,"User registration success ")
   )

})



export {registerUser}