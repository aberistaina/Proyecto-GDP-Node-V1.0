import { Router } from "express";
import {  verifyTokenMiddleware } from "../middlewares/login.middleware.js";
import { verificarRoles } from "../middlewares/rol.middleware.js";
import { getBitacoraMessages, createNewBitacoraMessage } from "../controllers/bitacora.controller.js";


const router = Router()


router.get("/get-bitacora-aprobaciones/:version", verifyTokenMiddleware, verificarRoles([3,1,5]), getBitacoraMessages)
router.post("/agregar", verifyTokenMiddleware, verificarRoles([3,1,5]), createNewBitacoraMessage)

export default router