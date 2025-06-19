import { Router } from "express";
import {  verifyTokenMiddleware } from "../middlewares/login.middleware.js";
import { verificarRoles } from "../middlewares/rol.middleware.js";
import { getAprobadores, enviarAprobacion, aprobarProceso, rechazarProceso } from "../controllers/aprobadores.controller.js";



const router = Router()

router.get("/get-all", verifyTokenMiddleware, getAprobadores)
router.post("/solicitar-aprobacion", verifyTokenMiddleware, verificarRoles([3,1,5]), enviarAprobacion)

router.post("/aprobar-proceso", verifyTokenMiddleware, verificarRoles([2,1,5]), aprobarProceso)
router.post("/rechazar-proceso", verifyTokenMiddleware, verificarRoles([2,1,5]), rechazarProceso)



export default router

