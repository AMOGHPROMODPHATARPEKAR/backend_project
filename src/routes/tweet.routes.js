import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet ,} from "../controllers/tweet.controller.js";

const router = Router()

router.route("/create").post(verifyJWT,createTweet)
router.route("/delete/:tweetId").post(verifyJWT,deleteTweet)
router.route("/update/:tweetId").patch(verifyJWT,updateTweet)
router.route("/getTweets").get(verifyJWT,getUserTweets)

export default router