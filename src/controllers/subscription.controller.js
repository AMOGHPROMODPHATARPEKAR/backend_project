import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const subcribe = asyncHandler(async(req,res)=>{
        const {channelId} = req.body;
        if(!channelId)
        {
            throw new ApiError(400,"channel Id is required")
        }
        const subscriberId = req.user._id;
        if(!subscriberId)
        {
            throw new ApiError(400,"Subcriber Id is required")
        }
        if(channelId == subscriberId)
        {
            throw new ApiError(400,"Subcriber cannot subscibe himself")
        }
        const already = await Subscription.findOneAndDelete(
            {
                $and:[
                {channel:channelId},
                {subscriber:subscriberId}
                ]
            }
        )
        
        if(already)
        {
            return res.status(201)
            .json(
                new ApiResponse(200,already,"Channel Unsubcribed")
            )
        }

        const subscriber = await User.findById(subscriberId).select("username fullname avatar"); //you can skip this
        if(!subscriber)
        {
            throw new ApiError(500,"Subcriber user not found")
        }

        const channel = await User.findById(channelId).select("username fullname avatar");//you can skip this
        if(!channel)
        {
            throw new ApiError(500,"Channel not found")
        }

        const subscription = await Subscription.create(
            {
            subscriber,
            channel
            }
        )
        if(!subscription)
        {
            throw new ApiError(500,"Error while creating Subscription ")
        }

        return res.status(200)
        .json(
            new ApiResponse(200,subscription,"Channel Subscribed Successfully")
        )

})

const getSubcriberInfo = asyncHandler(async(req,res)=>{
    const {subcriptionId} = req.body

    if(!subcriptionId)
    {
        throw new ApiError(400,"Subscription Id is required")
    }

    const subcription = await Subscription.findById(subcriptionId);
    if(!subcription)
    {
        throw new ApiError(500,"SUbcription details not found")
    }

    const subscriberId = subcription?.subscriber;
    // console.log(subscriberId)
    if(!subscriberId)
    {
        throw new ApiError(500,"subcriber id not found");
    }

    const subscriber = await User.findById(subscriberId);
    if(!subscriber)
    {
        throw new ApiError(500,"Subscriber details not found")
    }
    return res.status(200)
    .json(
        new ApiResponse(200,subscriber,"Subcriber details fetched successful")
    )

})

const getChannelInfo = asyncHandler(async(req,res)=>{
    const {subcriptionId} = req.body

    if(!subcriptionId)
    {
        throw new ApiError(400,"Subscription Id is required")
    }

    const subcription = await Subscription.findById(subcriptionId);
    if(!subcription)
    {
        throw new ApiError(500,"Subcription details not found")
    }

    const channelId = subcription?.channel;
    // console.log(channelId)
    if(!channelId)
    {
        throw new ApiError(500,"channel id not found");
    }

    const channel = await User.findById(channelId);
    if(!channel)
    {
        throw new ApiError(500,"Channel details not found")
    }
    return res.status(200)
    .json(
        new ApiResponse(200,channel,"Channel details fetched successful")
    )
})

const totalSubscriber = asyncHandler(async(req,res)=>{

    const {channelId} = req.params

    const count = await Subscription.countDocuments({channel:channelId})

    return res.status(200)
    .json(
        new ApiResponse(200,count,`total Subcriber to your channel is ${count}`)
    )

})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params


    const subList = await Subscription.aggregate(
        [
            {
                $match:{channel:new mongoose.Types.ObjectId(channelId)}
            },
            {
                $lookup:{
                    from:'users',
                    localField:'subscriber',
                    foreignField:'_id',
                    as:'subsciber',
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
        ]
    )

    if(!subList)
        {
            throw new ApiError(500,"Server error")
        }

        return res.status(200)
        .json(
            new ApiResponse(200,subList,"subscriber list fetched")
        )

})

const getSubscribedChannels = asyncHandler(async(req,res)=>{
    const {subscriberId} = req.params

    const channelList = await Subscription.aggregate(
        [
            {
                $match:{subscriber:new mongoose.Types.ObjectId(subscriberId)}
            },
            {
                $lookup:{
                    from:'users',
                    localField:'channel',
                    foreignField:'_id',
                    as:'channel',
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
                    channel:{
                        $first:"$channel"
                    }
                }
            }
        ]
    )
    console.log(channelList)
        if(!channelList)
        {
            throw new ApiError(500,"Server error")
        }

        return res.status(200)
        .json(
            new ApiResponse(200,channelList,"Channel list fetched")
        )
})

const subscribedNot = asyncHandler(async(req,res)=>{
    const {channelId} = req.body
    console.log("cc ",channelId)
    console.log('user ',channelId)
    const subcribed = await Subscription.findOne({subscriber:req.user._id, channel:channelId})
    if(!subcribed)
    {
        return res.status(201)
        .json(
            new ApiResponse(201,[],"Not subscibed")
        )
    }
    return res.status(200)
            .json(
                new ApiResponse(200,subcribed,"Subscribe info")
            )
})

export {subcribe}
export {getSubcriberInfo}
export {getChannelInfo}
export {totalSubscriber}
export {getSubscribedChannels}
export {getUserChannelSubscribers}
export {subscribedNot}