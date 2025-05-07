import { Router } from "express";
import { getAprobadores } from "../controllers/aprobadores.controller.js";
import { issueTokenMiddleware, verifyTokenMiddleware } from "../middlewares/login.middleware.js";


const router = Router()

router.get("/get-all", getAprobadores)



export default router