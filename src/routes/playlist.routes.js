import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist } from "../controllers/playlist.controller.js";

const router = Router()

router.route('/create').post(verifyJWT,createPlaylist)
router.route('/add/:playlistId/:videoId').patch(verifyJWT,addVideoToPlaylist)

export default router