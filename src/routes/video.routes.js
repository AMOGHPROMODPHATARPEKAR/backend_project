import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getVideo, uploadVideo } from "../controllers/video.controller.js";

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

export default router