import { Router } from "express";
import {  verifyTokenMiddleware } from "../middlewares/login.middleware.js";
import { verificarRoles } from "../middlewares/rol.middleware.js";
import { createOppotunity, getOpportunities, getOpportunitiesFiles } from "../controllers/oportunidades.controller.js";


const router = Router()

router.post("/agregar", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), createOppotunity)
router.get("/getAll/:idProceso/:version", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getOpportunities)
router.get("/get-files/:idComentario", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getOpportunitiesFiles)



export default router