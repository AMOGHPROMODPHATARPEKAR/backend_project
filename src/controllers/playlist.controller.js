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

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    const deleted = await Playlist.findOneAndDelete(
        {_id:playlistId}
    )
        console.log(deleted)
    if(!deleted)
    {
        throw new ApiError(500,"Error while deleting")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,deleted,"Deleted playlist Successfully")
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

const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId, videoId} = req.params

    
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                videos:(await Playlist.findById(playlistId)).videos.filter(obj => !obj._id.equals(videoId))
            },
        },
        {
            new:true
        }
    )
    if(!playlist)
    {
        throw new ApiError(500,"Error in deleting Video ")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,playlist,"Deleted successfully")
    )

}) 

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    const playlist = await Playlist.findById(playlistId).select("-createdAt -updatedAt");
    if(!playlist)
    {
        throw new ApiError(500,"Playlist not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,playlist,"Playlist fetched successfully")
    )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    
    const userPlaylist = await Playlist.find({owner:req.user?._id})
    if(!userPlaylist)
    {
        throw new ApiError(500,"Error fetching user playlist")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,userPlaylist,"User playlist fetched successfully")
    )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    
    const updated = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name:name,
                description:description,
            }
        },
        {
            new:true
        }
    )

    if(!updated)
    {
        throw new ApiError(400,"Error while updating")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,updated,"Updated successfully")
    )

})


export 
    {createPlaylist,
        addVideoToPlaylist,
        removeVideoFromPlaylist,
        getPlaylistById,
        getUserPlaylists,
        deletePlaylist,
        updatePlaylist
}   