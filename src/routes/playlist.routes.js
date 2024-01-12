import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router()

router.route('/create').post(verifyJWT,createPlaylist)
router.route('/add/:playlistId/:videoId').patch(verifyJWT,addVideoToPlaylist)
router.route('/remove/:playlistId/:videoId').patch(verifyJWT,removeVideoFromPlaylist)
router.route('/get/:playlistId').get(verifyJWT,getPlaylistById)
router.route('/userPlaylist').get(verifyJWT,getUserPlaylists)
router.route('/del/:playlistId').post(verifyJWT,deletePlaylist)
router.route('/update/:playlistId').patch(verifyJWT,updatePlaylist)


export default router