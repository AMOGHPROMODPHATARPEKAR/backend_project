import { Subscription } from "../models/subscription.models.js";
import { Video } from "../models/video.models.js";
import { Like } from "../models/like.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { ApiError } from "../utils/ApiError.js";

const getChannelStats = asyncHandler(async (req, res) => {
    

    const totalSubscriber = await Subscription.countDocuments({channel:req.user?._id})

    const totalVideos = await Video.countDocuments({owner:req.user._id})

    const totalLikes = await  Like.countDocuments(
       { 
        video: { $in: await Video.find({ owner: req.user._id }).distinct('_id') }
        }
    )
    
    const subcribedTo = await Subscription.countDocuments({subscriber:req.user?._id})

    const stat = {
        totalSubscriber:totalSubscriber,
        totalLikes:totalLikes,
        totalVideos:totalVideos,
        subcribedTo:subcribedTo,
    }

    return res.status(200)
    .json(
        new ApiResponse(200,stat,"All statistics fetched successfully")
    )

})

const getChannelVideos = asyncHandler(async (req, res) => {
    
    
    const videos = await Video.aggregate([
        {
            $match:{owner:req.user._id}},
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            fullname:1,
                            username:1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        },
        {
            $project:{
                id:1,
                videoFile:1,
                thumbnail:1,
                title:1,
                owner:1,
                description:1
            }
        }
        ])

    if(!videos)
    {
        throw new ApiError(500,"Error to get videos list ::dashbaord")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,videos,"All videos of Channel")
    )


})

export {
    getChannelStats,
    getChannelVideos
}