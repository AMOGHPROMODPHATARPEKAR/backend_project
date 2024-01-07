import { Comment } from "../models/comments.models.js";
import { Like } from "../models/like.models.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.models.js";

const toggleVideoLike = asyncHandler(async(req,res)=>{

    const {videoId} = req.params

    const already = await Like.findOneAndDelete(
        {video:videoId , likedBy:req.user?._id }
    )
    
    if(already)
    {
        return res.status(200)
        .json(
            new ApiResponse(200,already,"Removed the Like from Video")
        )
    }

    const video  = await Video.findById(videoId)
    if(!video)
    {
        throw new ApiError(500,"Video not found")
    }

    

    const likedBy = await User.findById(req.user?._id)
    if(!likedBy)
    {
        throw new ApiError(500,"User not found")
    }

    const like = await Like.create(
        {
        video,
        likedBy:req.user?._id
         }
    )

    if(!like)
    {
        throw new ApiError(500,"Cannot create server error ")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,like,"Liked the video")
    )

})

const toggleCommentLike = asyncHandler(async(req,res)=>{
    const {commentId} = req.params
    
    const already = await Like.findOneAndDelete(
        {comment:commentId , likedBy:req.user?._id }
    )
    
    if(already)
    {
        return res.status(200)
        .json(
            new ApiResponse(200,already,"Removed the Like from Comment")
        )
    }

    const comment = await Comment.findById(commentId)
    if(!comment)
    {
        throw new ApiError(500,"Comment not found")
    }
    

    const like = await Like.create(
        {
        comment,
        likedBy:req.user?._id
         }
    )

    if(!like)
    {
        throw new ApiError(500,"Cannot create server error ")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,like,"Liked the video")
    )
})

const toggleTweetLike = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params
    
    const already = await Like.findOneAndDelete(
        {tweet:tweetId , likedBy:req.user?._id }
    )
    
    if(already)
    {
        return res.status(200)
        .json(
            new ApiResponse(200,already,"Removed the Like from Tweet")
        )
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet)
    {
        throw new ApiError(500,"Tweet not found")
    }
    

    const like = await Like.create(
        {
        tweet,
        likedBy:req.user?._id
         }
    )

    if(!like)
    {
        throw new ApiError(500,"Cannot create server error ")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,like,"Liked the video")
    )
})

const getLikedVideos = asyncHandler(async(req,res)=>{
    
    const Likedvideo = await Like.find(
        {likedBy:req.user?._id, video:{ $exists: true }}
    )
    if(!Likedvideo)
    {
        throw new ApiError(400,"No data found user didnt like any video")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,Likedvideo,`Video liked by ${req.user?.username}`)
    )

})

export {toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}