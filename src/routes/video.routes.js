import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { fetchVideoFromDatabase, verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getVideo, updateThumbnail, updateVideo, updateVideoDetails, uploadVideo } from "../controllers/video.controller.js";

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



export default router