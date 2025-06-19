import { Router } from "express";
import {  verifyTokenMiddleware } from "../middlewares/login.middleware.js";
import { verificarRoles } from "../middlewares/rol.middleware.js";
import { getNiveles, getNivelById } from "../controllers/niveles.controller.js";


const router = Router()

router.get("/get-niveles", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getNiveles)
router.get("/get-nivel/:idNivel", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getNivelById)



export default router