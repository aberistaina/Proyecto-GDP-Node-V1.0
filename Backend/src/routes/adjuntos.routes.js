import { Router } from "express";
import {  verifyTokenMiddleware } from "../middlewares/login.middleware.js";
import { verificarRoles } from "../middlewares/rol.middleware.js";
import { cargarAdjuntos, obtenerAdjuntos } from "../controllers/adjuntos.controller.js";




const router = Router()

router.get("/get-files/:version", verifyTokenMiddleware, obtenerAdjuntos)

router.post("/cargar-adjuntos", verifyTokenMiddleware, verificarRoles([3,1,5]), cargarAdjuntos)




export default router

