import { Router } from "express";
import { getAprobadores } from "../controllers/aprobadores.controller.js";
import {  verifyTokenMiddleware } from "../middlewares/login.middleware.js";


const router = Router()

router.get("/get-all", verifyTokenMiddleware, getAprobadores)



export default router