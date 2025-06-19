import { Router } from "express";
import {  verifyTokenMiddleware } from "../middlewares/login.middleware.js";
import { verificarRoles } from "../middlewares/rol.middleware.js";
import { createCommentary, getCommentaries, getComentariesFiles } from "../controllers/comentarios.controller.js";



const router = Router()

router.post("/agregar", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), createCommentary)
router.get("/getAll/:idProceso/:version", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getCommentaries)
router.get("/get-files/:idComentario", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getComentariesFiles)




export default router