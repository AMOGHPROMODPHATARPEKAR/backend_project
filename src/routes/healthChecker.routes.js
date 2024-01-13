import { Router } from "express";
import { healthcheck } from "../controllers/healthChecker.controller.js";

const router = Router()

router.route('/get').get(healthcheck)


export default router