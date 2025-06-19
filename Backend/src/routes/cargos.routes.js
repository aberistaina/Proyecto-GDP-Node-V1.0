import { Router } from "express";
import {  verifyTokenMiddleware } from "../middlewares/login.middleware.js";
import { verificarRoles } from "../middlewares/rol.middleware.js";
import { getAllCargos } from "../controllers/admin.controller.js";



const router = Router()

router.get("/get-all-cargos", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getAllCargos)


export default router