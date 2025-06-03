import { Router } from "express";

import { issueTokenMiddleware, verifyTokenMiddleware } from "../middlewares/login.middleware.js";
import { createCargo, createNivel, createRol, createUser, deleteCargo, deleteNivel, deleteRol, deleteUser, getAdminDataConfig, getAllCargos, getAllNiveles, getAllRoles, getAllUsers, getCardData, getCargoById, getEntidades, getNivelById, getRolById, getUserById, setAdminConfig, updateCargo, updateNivel, updateRol, updateUser } from "../controllers/admin.controller.js";


const router = Router()

router.get("/all-users", getAllUsers)
router.get("/get-user/:id", getUserById)
router.get("/all-roles", getAllRoles)
router.get("/get-rol/:id", getRolById)
router.get("/all-cargos", getAllCargos)
router.get("/get-cargo/:id", getCargoById)
router.get("/all-niveles", getAllNiveles)
router.get("/get-nivel/:id", getNivelById)
router.get("/cards-data", getCardData)
router.get("/all-entidades", getEntidades)

router.post("/create-user", createUser)
router.post("/create-cargo", createCargo)
router.post("/create-rol", createRol)
router.post("/create-nivel", createNivel)

router.put("/update-user/:id", updateUser)
router.put("/update-cargo/:id", updateCargo)
router.put("/update-rol/:id", updateRol)
router.put("/update-nivel/:id", updateNivel)

router.delete("/delete-user/:id", deleteUser)
router.delete("/delete-cargo/:id", deleteCargo)
router.delete("/delete-rol/:id", deleteRol)
router.delete("/delete-nivel/:id", deleteNivel)

router.get("/get-config", getAdminDataConfig)
router.post("/set-config", setAdminConfig)


export default router