import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, totalComment } from "../controllers/comment.controller.js";

const router = Router()

router.route("/addComment/:videoId").post(verifyJWT,addComment)
router.route("/delete/:commentId").post(verifyJWT,deleteComment)
router.route("/total/:videoId").get(totalComment)


export default router