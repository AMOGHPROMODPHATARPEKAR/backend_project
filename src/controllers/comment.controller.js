import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Comment} from "../models/comments.models.js"
import { ApiResponse } from "../utils/Apiresponse.js";


const addComment = asyncHandler(async(req,res)=>{

    const {videoId} = req.params
    const {content} =req.body

    if(!content)
    {
        throw new ApiError(400,"Content is required")
    }

    const video = await Video.findById(videoId)
    if(!video)
    {
        throw new ApiError(500,"Video not found")
    }
    
    const comment = await Comment.create(
        {
            content,
            video,
            owner:req.user,
        }
    )
    if(!comment)
    {
        throw new ApiError(500,"Comment not create")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,comment,"Comment added successfully")
    )

})

const deleteComment = asyncHandler(async(req,res)=>{
    const {commentId}=req.params

    const comment = await Comment.findById(commentId)
    console.log(comment)

    if(!comment)
    {
        throw new ApiError(500,"comment Doesnt exist")
    }
    console.log("ou",comment.owner,req.user?._id)
    if(comment.owner.toString() === req.user?._id.toString())
    {
       console.log("ok")
    }
    else
    {
        console.log("ou",comment.owner === req.user?._id)
        throw new ApiError(400,"You cannot delete others comment")
    }

    const deleted = await Comment.findByIdAndDelete(commentId)
    if(!deleted)
    {
        throw new ApiError(500,"Error while deleting comment")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,{},"Comment deleted successfully")
    )

})

const totalComment = asyncHandler(async(req,res)=>{

    const {videoId} = req.params
    const {limit = 10} = req.query

    const comments = await Comment.find(
        {video:videoId},
        {content:1,_id:0}
        ).limit(limit)
        console.log(comments)
       if(!comments)
       {
        throw new ApiError(500,"Server error or no comments")
       } 
    return res.status(200)
    .json(
        new ApiResponse(200,comments,"total comments fetched successfully")
    )
})

const updateComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params
    const {content} = req.body

    const updated = await Comment.updateOne(
        {_id:commentId},
        {
            $set:{content:content}
        }
    )
    if(!updated)
    {
        throw new ApiError(500,"Comment Not Found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,updated,"Comment Updated!")
    )

})

export {addComment}
export {deleteComment}
export {totalComment}
export {updateComment}