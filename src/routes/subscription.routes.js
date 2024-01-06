import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelInfo, getSubcriberInfo, subcribe, totalSubscriber, unsubscribe } from "../controllers/subscription.controller.js";


const router = Router()

router.route("/addSubscribe").post(verifyJWT,subcribe)
router.route("/getSubscriber").get(getSubcriberInfo)
router.route("/getChannel").get(verifyJWT,getChannelInfo)
router.route("/unsubscribe/:num").post(verifyJWT,unsubscribe)
router.route("/totalSubcriber/:channelId").get(totalSubscriber)

export default router