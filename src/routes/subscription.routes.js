import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelInfo, getSubcriberInfo, getSubscribedChannels, getUserChannelSubscribers, subcribe, subscribedNot, totalSubscriber} from "../controllers/subscription.controller.js";


const router = Router()

router.use(verifyJWT)

router.route("/toggleSubsciption").post(subcribe)
router.route("/getSubscriber").get(getSubcriberInfo)
router.route("/getChannel").get(getChannelInfo)
router.route("/totalSubcriber/:channelId").get(totalSubscriber)
router.route("/subscribedTo/:subscriberId").get(getSubscribedChannels)
router.route('/channelSubscriber/:channelId').get(getUserChannelSubscribers)
router.route('/subOrNot').post(subscribedNot)

export default router