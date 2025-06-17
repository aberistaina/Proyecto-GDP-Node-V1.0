import { Router } from "express";

import { verifyTokenMiddleware } from "../middlewares/login.middleware.js";
import { verificarRoles } from "../middlewares/rol.middleware.js";
import { createCargo, createNivel, createRol, createUser, deleteCargo, deleteNivel, deleteRol, deleteUser, getAdminDataConfig, getAllCargos, getAllNiveles, getAllRoles, getAllUsers, getCardData, getCargoById, getEntidades, getNivelById, getRolById, getUserById, setAdminConfig, updateCargo, updateNivel, updateRol, updateUser, uploadProcess } from "../controllers/admin.controller.js";


const router = Router()

//Rutas Administrador
router.get("/all-users",verifyTokenMiddleware, verificarRoles([1, 5]), getAllUsers)
router.get("/get-user/:id",verifyTokenMiddleware, verificarRoles([1, 5]), getUserById)
router.get("/all-roles", verifyTokenMiddleware, verificarRoles([1, 5]), getAllRoles)
router.get("/get-rol/:id", verifyTokenMiddleware, verificarRoles([1, 5]), getRolById)
router.get("/all-cargos", verifyTokenMiddleware, verificarRoles([1, 5]), getAllCargos)
router.get("/get-cargo/:id", verifyTokenMiddleware, verificarRoles([1, 5]), getCargoById)
router.get("/all-niveles", verifyTokenMiddleware, verificarRoles([1, 5]), getAllNiveles)
router.get("/get-nivel/:id", verifyTokenMiddleware, verificarRoles([1, 5]), getNivelById)
router.get("/cards-data", verifyTokenMiddleware, verificarRoles([1, 5]), getCardData)
router.get("/all-entidades", verifyTokenMiddleware, verificarRoles([1, 5]), getEntidades)
router.get("/get-config", verifyTokenMiddleware, verificarRoles([1, 5]), getAdminDataConfig)

router.post("/create-user", verifyTokenMiddleware, verificarRoles([1, 5]), createUser)
router.post("/create-cargo", verifyTokenMiddleware, verificarRoles([1, 5]), createCargo)
router.post("/create-nivel", verifyTokenMiddleware, verificarRoles([1, 5]), createNivel)
router.post("/set-config", verifyTokenMiddleware, verificarRoles([1, 5]), setAdminConfig)

router.put("/update-user/:id",verifyTokenMiddleware, verificarRoles([1, 5]), updateUser)
router.put("/update-cargo/:id", verifyTokenMiddleware, verificarRoles([1, 5]), updateCargo)
router.put("/update-nivel/:id",verifyTokenMiddleware, verificarRoles([1, 5]), updateNivel)

router.delete("/delete-user/:id",verifyTokenMiddleware, verificarRoles([1, 5]), deleteUser)
router.delete("/delete-cargo/:id", verifyTokenMiddleware, verificarRoles([1, 5]), deleteCargo)
router.delete("/delete-rol/:id", verifyTokenMiddleware, verificarRoles([5]), deleteRol)
router.delete("/delete-nivel/:id", verifyTokenMiddleware, verificarRoles([1, 5]), deleteNivel)




//Rutas Super Administrador
router.post("/upload-process", verifyTokenMiddleware, verificarRoles([5]), uploadProcess)
router.post("/create-rol", verifyTokenMiddleware, verificarRoles([5]), createRol)

router.put("/update-rol/:id", verifyTokenMiddleware, verificarRoles([5]), updateRol)

export default router