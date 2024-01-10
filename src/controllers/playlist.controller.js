import { Playlist } from "../models/playlist.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async(req,res)=>{

    const {name,description} = req.body

    if(!name || !description)
    {
        throw new ApiError(400,"Both field are required")
    }

    const playlist  = await Playlist.create(
        {
            name,
            description,
            owner:req.user._id,
        }
    )
    if(!playlist)
        {
            throw new ApiError(500,"Server error")
        }

    return res.status(200)
    .json(
        new ApiResponse(200,playlist,"Playlist created successfully")
    )

})

const addVideoToPlaylist  = asyncHandler(async(req,res)=>{
    const {playlistId, videoId} = req.params

    const video = await Video.findById(videoId)

    if(!video)
    {
        throw new ApiError(500,"video not found")
    }

    

    const playlist = await Playlist.findById(playlistId)

    if(!playlist)
    {
        throw new ApiError(500,"Playlist not found")
    }

    let videos = playlist?.videos
     

    if(videos)
    {
        videos = videos?.filter(obj => !obj._id.equals(videoId));
        videos.push(video);
    }
    else
    {
        throw new ApiError(400,"Videos Not found")
    }

    const updated = await Playlist.updateOne(
        {_id:playlistId},
        {
            $set:{
                videos:videos,
            }
        },
        {
            new:true
        }
    )
    if(!updated){
        throw new ApiError(500,"Error while updating")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,updated,"Videos added to Playlist")
    )

})

export 
    {createPlaylist,
        addVideoToPlaylist
}   