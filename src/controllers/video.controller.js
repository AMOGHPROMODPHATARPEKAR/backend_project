import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { deleteVideoById } from "../db/index.js";

const uploadVideo = asyncHandler( async (req,res)=>{
   const {title,description} = req.body;

   if (
    [title, description].some((field) => {
        field?.trim() === ""
    })
) {
    throw new ApiError(404, "All fields are required")
}

    const videoLocal = req.files?.videoFile[0]?.path;

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
    const video = await Video.findById(username);
    if(!video)
    {
        throw new ApiError(400,"Video not Found")
    }
    
    return res.status(200)
    .json(
      new ApiResponse(200,video,"current video  fetched successfully")  
        )

})

export {uploadVideo}
export {deleteVideo}
export {getVideo}