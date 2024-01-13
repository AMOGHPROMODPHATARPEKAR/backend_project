import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/getStat').get(getChannelStats)
router.route('/getChannel').get(getChannelVideos)

export default router