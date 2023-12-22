import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import jwt from 'jsonwebtoken'
import { json } from "express";

//method for generating access and refresh token

const generateAccessAndRefreshTokens = async (userId) => {

    try {

        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong in generating access and refresh token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    const { username, email, fullname, password } = req.body
    //    console.log("email:",email);

    //validation
    if (
        [fullname, email, username, password].some((field) => {
            field?.trim() === ""
        })
    ) {
        throw new ApiError(404, "All fields are required")
    }

    //check if user already exit
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    }
    )
    if (existedUser) {
        throw new ApiError(409, "User with same email or username already exists")
    }

    //check images check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path

    //    const coverImageLocalPath= req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    //upload to cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    //create user object- create entry in db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //check for user creation
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while reistering user")
    }

    //return res

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registration success ")
    )

})

const loginUser = asyncHandler(async (req, res) => {

    //req body ->data
    const { email, username, password } = req.body

    //username or email login
    if (!username && !email) {
        throw new ApiError(400, "User and email is required")
    }
    //if anyone then use if(!(username || email))
    //find user
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }
    console.log("user : ",user)
    //password check
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Inavalid User Password")
    }

    //access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    //send cookie
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        )

})


const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
   const name = req.user?.username
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, `${name} logged out` ))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshtoken = req.cookies.refreshToken || req.body.refreshToken
console.log("inc token ",incomingRefreshtoken)
    if (!incomingRefreshtoken) {
        throw new ApiError(401, "Unauthorized request")
    }


    try {
        const decodedToken = jwt.verify(incomingRefreshtoken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshtoken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user?._id)

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200, {
                    accessToken, refreshToken: newRefreshToken
                },
                    "Access Token Refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }


})


const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword ,confPassword} = req.body

    const user = await User.findById(req.user?.id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, " old Password Incorrect")
    }
     if(newPassword !== confPassword)
     {
        throw new ApiError(400,"New and Confirmed password Mismatched")
     }
    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res.status(200)
    .json(
        new ApiResponse(200,{},"Password changed successfully")
    )
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(
      new ApiResponse(200,req.user,"current user fetched successfully")  
        )
})

const updateAccountDetails = asyncHandler(async(req,res)=>{

    const {fullname,email} = req.body

    if(!fullname || !email)
    {
        throw new ApiError(400,"All field are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
       $set:{
       fullname:fullname,
       email:email,
       }
        },
        {
            new:true,
        }).select("-password")
if(!user)
{
    throw new ApiError(500,"Server unable to fetch")
}
        return res.status(200)
        .json(
            new ApiResponse(200,req.user,"Account details updated")
        )

})


const updateUserAvatar = asyncHandler(async(req,res)=>{

    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath)
    {
        throw new ApiError(400,"Avatar file is missing")
    }

   const avatar =await uploadOnCloudinary(avatarLocalPath)

   if(!avatar.url)
   {
    throw new ApiError(400,"error while Uploading the avatar")
   }

   const user = await  User.findByIdAndUpdate(
    req.user?._id,
    {
        $set:{
            avatar :avatar.url
        }
    },
    {
        new:true
    }
   )
   return res.status(200)
   .json(
    new ApiResponse(200,user,"Avatar updated succesfull")
   )
})


const updateUserCoverImage = asyncHandler(async(req,res)=>{

    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath)
    {
        throw new ApiError(400,"cover Image file is missing")
    }

   const coverImage =await uploadOnCloudinary(coverImageLocalPath)

   if(!coverImage.url)
   {
    throw new ApiError(400,"error while Uploading the cover image")
   }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set:{
            coverImage :coverImage.url
        }
    },
    {
        new:true
    }
   )

   return res.status(200)
   .json(
    new ApiResponse(200,user,"cover image updated succesfull")
   )
})

export { registerUser }
export { loginUser }
export { logoutUser }
export { refreshAccessToken }
export {changeCurrentPassword}
export{getCurrentUser}
export {updateAccountDetails}
export {updateUserAvatar}
export {updateUserCoverImage}