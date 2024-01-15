import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {  verifyJWT } from "../middlewares/auth.middleware.js";
import { addWatchHistory, deleteVideo, deleteWatchHistory, getAllVideos, getVideo, toggelPublishstatus, updateThumbnail, updateVideo, updateVideoDetails, uploadVideo } from "../controllers/video.controller.js";

const router = Router()

router.route("/videoUpload").post(
    verifyJWT,
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ])
    ,uploadVideo)

    router.route("/deleteVideo/:num").post(verifyJWT,deleteVideo)
    router.route("/get/:username").get(verifyJWT,getVideo)
    router.route("/updateDetails/:num").patch(verifyJWT,updateVideoDetails)
    router.route("/updateVideo/:num").patch(verifyJWT,upload.single("videoFile"),updateVideo)
    router.route("/updateThumbnail/:num").patch(verifyJWT,upload.single("thumbnail"),updateThumbnail)
    router.route("/addHistory/:num").patch(verifyJWT,addWatchHistory)
    router.route("/deleteHistory/:num").patch(verifyJWT,deleteWatchHistory)
    router.route('/getAllVideo').get(getAllVideos)
    router.route("/togglePublish/:videoId").patch(verifyJWT,toggelPublishstatus)

export default router