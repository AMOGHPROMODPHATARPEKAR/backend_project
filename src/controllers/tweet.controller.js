import { Tweet } from "../models/tweet.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/Apiresponse.js";

const createTweet = asyncHandler(async(req,res)=>{

    const {content} = req.body

    if(!content)
    {
        throw new ApiError(400,"COntent is required")
    }

    const tweet = await Tweet.create(
        {
            content,
            owner:req.user?._id
        }
    )

    if(!tweet)
    {
        throw new ApiError(500,"Cannot create a tweet")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,tweet,"Tweet create successfully")
    )

})

const deleteTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params

    const deleted =  await Tweet.deleteOne(
        {_id:tweetId}
    )
    // console.log(deleted)
    
    if(deleted.deletedCount == 0)
    {
        throw new ApiError(500,"Already deleted")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,deleted,"Deleted Tweet Successfully")
    )

})

const updateTweet = asyncHandler(async(req,res)=>{

    const {tweetId} = req.params

    const {content} = req.body
    if(!content)
    {
        throw new ApiError(400,"Content is required")
    }

    const updated = await Tweet.findByIdAndUpdate(
        tweetId,
       {
        $set:{
            content:content
        }
       },
       {
        new:true
       }
    )

    if(!updated)
    {
        throw new ApiError(500,"server error")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,updated,"Updated successfully")
    )

})

const getUserTweets = asyncHandler(async(req,res)=>{

    const tweet = await Tweet.find(
        {owner:req.user?._id}
    )

    if(!tweet)
    {
        throw new ApiError(500,"Not tweet found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,tweet,"Tweets fetched")
    )

})

export {
    createTweet,
    deleteTweet,
    updateTweet,
    getUserTweets
}