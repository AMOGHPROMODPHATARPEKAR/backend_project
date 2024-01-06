import { deleteSubscriberById } from "../db/index.js";
import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


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
        const subscriber = await User.findById(subscriberId);
        if(!subscriber)
        {
            throw new ApiError(500,"Subcriber user not found")
        }

        const channel = await User.findById(channelId);
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
            new ApiResponse(200,subscription,"Subscription completed successful")
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

const unsubscribe =  asyncHandler(async(req,res)=>{

    const {num} = req.params

    const deleted = await deleteSubscriberById(num)

    if(!deleted)
    {
        throw new ApiError(500,"Error while deleting")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,{},"Subscription deleted successfully")
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

export {subcribe}
export {getSubcriberInfo}
export {getChannelInfo}
export {unsubscribe}
export {totalSubscriber}