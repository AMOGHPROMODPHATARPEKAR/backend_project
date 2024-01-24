import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike, videoLikes, videoliked } from "../controllers/like.controller.js";

const router = Router()
router.route("/toggleVideoLike/:videoId").post(verifyJWT,toggleVideoLike)
router.route("/toggleCommentLike/:commentId").post(verifyJWT,toggleCommentLike)
router.route("/toggleTweetLike/:tweetId").post(verifyJWT,toggleTweetLike)
router.route("/getVideoLiked").get(verifyJWT,getLikedVideos)
router.route("/videoLikes/:id").get(videoLikes)
router.route("/videoLiked/:id").get(verifyJWT,videoliked)

export default router