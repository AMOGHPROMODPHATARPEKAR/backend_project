import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { deleteVideoById } from "../db/index.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";
import { json } from "express";

const uploadVideo = asyncHandler( async (req,res)=>{
   const {title,description} = req.body;
   if (
    [title, description].some((field) => {
        field?.trim() === ""
    })
) {
    throw new ApiError(404, "All fields are required")
}
    // console.log("REQ:",req)

    const videoLocal = req.files?.videoFile[0]?.path;
    console.log(req.files)
    console.log(req.body)
    if(!videoLocal)
    {
        throw new ApiError(400, "Video File is required")
    }

    const thumbnailLocal = req.files?.thumbnail[0]?.path;
    if(!thumbnailLocal)
    {
        throw new ApiError(400, "Thumbnail File is required")
    }

    const videoFile = await uploadOnCloudinary(videoLocal);
    if(!videoFile)
    {
        throw new ApiError(401,"Error while Uploading in Cloundinary")
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocal);
    if(!thumbnail)
    {
        throw new ApiError(401,"Error while Uploading in Cloundinary")
    }

    const video = await Video.create({
        videoFile:videoFile.url,
        thumbnail:thumbnail.url,
        title,
        description,
        owner:req.user._id,
        duration:videoFile.duration
    })

    const createdVideo = await Video.findById(video._id).select("-isPublish -owner") 

    if(!createdVideo)
    {
        throw new ApiError(500,"Something went wrong while Uploading")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,createdVideo,"Successfully uploaded")
    )
})

const deleteVideo = asyncHandler( async (req,res) =>{
      const {num} = req.params;

      const video = await Video.findById(num)
      if(!video)
      {
          throw new ApiError(400,"Video NOt found")
        }
        const videoID = video.videoFile.split('/').pop().replace(/\.[^/.]+$/, '');
        const thumbID = video.thumbnail.split('/').pop().replace(/\.[^/.]+$/, '');

        const deleteVideo = await deleteVideoById(num)
        
        console.log(deleteVideo)
        if(!deleteVideo)
        {
            throw new ApiError(500,"Video not able to delete")
        }

        
        const deleteLocalVideo = await deleteFromCloudinary(videoID,'video');
        
        if(!deleteLocalVideo)
      {
        throw new ApiError(500,"Error from Cloundinary ved while Deleting")
      }
      
      const deleteLocalThumb = await deleteFromCloudinary(thumbID)
 
      if(!deleteLocalThumb)
      {
        throw new ApiError(500,"Error from Cloundinary while Deleting")
      }
      

      return res.status(200)
      .json(
        new ApiResponse(200,{},"Video Deleted Successfully")
      )
})

const getVideo = asyncHandler(async (req,res) =>{

    const {username} = req.params

    console.log(username)
    const video = await Video.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(username)}
        },
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
        }
    ])
    if(!video)
    {
        throw new ApiError(400,"Video not Found")
    }
    
    return res.status(200)
    .json(
      new ApiResponse(200,video,"current video  fetched successfully")  
        )

})

const updateVideoDetails = asyncHandler(async (req,res) =>{

    const {title,description} = req.body;
    
    if(!title && !description)
    {
        throw new ApiError(400,"Any one field is required")
    }
    const {num} = req.params

    const video = await Video.findByIdAndUpdate(
        num,
        {
            $set:{
                title:title,
                description:description
            }
        },
        {
            new:true
        }
    ).select("-isPublish")

    if(!video)
    {
        throw new ApiError(500,"Unable to fetch the video deatils")
    }

    return res.status(200)
        .json(
            new ApiResponse(200,video,"Account details updated")
        )

})

const updateVideo =asyncHandler(async (req,res) =>{
    
    const {num} = req.params;


    const videoLocal = req.file?.path;
    console.log("videolocal in server",videoLocal)
    if(!videoLocal)
    {
        throw new ApiError(400,"Video is Required")
    }

    const video = await Video.findById(num)
    if(!video)
    {
        throw new ApiError(401,"Original Video not available")
    }

    const videoFile = await uploadOnCloudinary(videoLocal)

    if(!videoFile)
    {
        throw new ApiError(500,"Error while uploading on Cloudinary")
    }

    const publicId = video?.videoFile.split('/').pop().replace(/\.[^/.]+$/, '');

    if(!publicId)
    {
        throw new ApiError(400,"Public id not found")
    }
    const deleted = await deleteFromCloudinary(publicId,"video")

   if(!deleted)
   {
    throw new ApiError(400,"Error while deleting") 
   } 

   const updated = await Video.findByIdAndUpdate(
    num,{
   
   $set:{
    videoFile:videoFile.url
   }
  },
   {
    new:true
   }
   )

   if(!updated)
   {
    throw new ApiError(400,"unable to update")
   }

   return res.status(200)
   .json(
    new ApiResponse(200,updated,"Video Updated Successfully")
   )

})

const updateThumbnail = asyncHandler(async (req,res) =>{
    
    const {num} = req.params;


    const thumbnailLocalLocal = req.file?.path;

    if(!thumbnailLocalLocal)
    {
        throw new ApiError(400,"THumbnail is Required")
    }

    const video = await Video.findById(num)
    if(!video)
    {
        throw new ApiError(401,"Original Video not available")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalLocal)

    if(!thumbnail)
    {
        throw new ApiError(500,"Error while uploading on Cloudinary")
    }

    const publicId = video?.thumbnail.split('/').pop().replace(/\.[^/.]+$/, '');

    if(!publicId)
    {
        throw new ApiError(400,"Public id not found")
    }
    const deleted = await deleteFromCloudinary(publicId)

   if(!deleted)
   {
    throw new ApiError(400,"Error while deleting") 
   } 

   const updated = await Video.findByIdAndUpdate(
    num,{
   
   $set:{
    thumbnail:thumbnail.url
   }
  },
   {
    new:true
   }
   )

   if(!updated)
   {
    throw new ApiError(400,"unable to update")
   }

   return res.status(200)
   .json(
    new ApiResponse(200,updated,"Thumbnail Updated Successfully")
   )
})

const addWatchHistory = asyncHandler(async (req,res) =>{

    const {num} = req.params;

    const video = await Video.findById(num)
    if(!video)
    {
        throw new ApiError(500,"Video Not Found")
    }
    
    let watchHistory = req.user?.watchHistory;
     

    if(watchHistory)
    {
        watchHistory = watchHistory?.filter(obj => !obj._id.equals(num));
        watchHistory.unshift(video);
    }
    else
    {
        throw new ApiError(400,"Watch history Not found")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                watchHistory:watchHistory
            }
        },
        {
            new:true
        }
        );

    if(!user)
    {
        throw new ApiError(400,"User Not Found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,user,"Added watch history successfully ")
    )


})

const deleteWatchHistory = asyncHandler(async(req,res)=>{
    const {num} = req.params;

    const video = await Video.findById(num)
    if(!video)
    {
        throw new ApiError(500,"Video Not Found")
    }
    
    let watchHistory = req.user?.watchHistory;
    if(watchHistory){
    watchHistory = watchHistory?.filter(obj => !obj._id.equals(num));
    }else
    {
        throw new ApiError(400,"Watch history Not found")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                watchHistory:watchHistory
            }
        },
        {
            new:true
        }
        );

    if(!user)
    {
        throw new ApiError(400,"User Not Found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,user,"Added watch history successfully ")
    )

})

const getAllVideos = asyncHandler(async(req,res)=>{
    const { limit = 10,page=1, sortBy='createdAt', sortType='desc',userId} = req.query;

    // Define the initial match stage based on userId, if provided
    const matchStage = userId ? { owner: new mongoose.Types.ObjectId(userId) } : {isPublish:true};
    console.log(matchStage)
    // Define the sort stage based on sortBy and sortType
    const sortStage = sortBy ? { $sort: { [sortBy]: sortType === 'desc' ? -1 : 1 } } : {};

    try {
        const videos = await Video.aggregate([
            {
                $match:matchStage
            },
            sortStage,
            // Add more pipeline stages as needed
            { $limit: parseInt(limit) },
            {$skip:(page - 1) * parseInt(limit)},
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
            throw new ApiError(500,"Error video:: Videos")
        }

        return res.status(200)
        .json(
            new ApiResponse(200,videos,"sucees")
        )
        
    } catch (error) {
        console.error('Error retrieving videos:', error);
        throw new ApiError(500,"Error video:: Videos")
    }
})

const toggelPublishstatus = asyncHandler(async(req,res)=>{
    const { videoId } = req.params

    const updatedVideo = await Video.findOneAndUpdate(
        {_id:videoId, owner:req.user._id },
        {
            isPublish:!((await Video.findById(videoId)).isPublish),
        },
        {
            new:true
        }
    )
    if(!updatedVideo)
    {
        throw new ApiError(500,"error :: Video :: toggelPublish :: Owner is not same or video Not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,updatedVideo,`Toggled Publish status successfully from ${!(updatedVideo.isPublish)} to ${updatedVideo.isPublish} `)
    )

})

const addView = asyncHandler(async(req,res)=>{
    const {id} = req.params

    const video = await Video.findOneAndUpdate(
        {
            _id: id
        },
        {
            $inc:{views:1}
        },
        {
            new:true
        }
    )
    if(!video)
    {
        throw new ApiError(400,"VIdeo not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,video,"Added a view")
    )

})

export {uploadVideo}
export {deleteVideo}
export {getVideo}
export {updateVideoDetails}
export {updateVideo}
export {updateThumbnail}
export {addWatchHistory}
export {deleteWatchHistory}
export {getAllVideos}
export {toggelPublishstatus}
export {addView}