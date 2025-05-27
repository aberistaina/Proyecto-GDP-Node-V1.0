import { Router } from "express";
import { createUser, login, forgotPassword, changePassword, getAuthenticatedUser, logout } from "../controllers/auth.controller.js";
import { issueTokenMiddleware, verifyTokenMiddleware } from "../middlewares/login.middleware.js";


const router = Router()

router.post("/register", createUser)
router.post("/login", issueTokenMiddleware, login)
router.post("/logout", logout)
router.post("/recover-password", forgotPassword)
router.post("/change-password", verifyTokenMiddleware, changePassword)
router.get("/me", getAuthenticatedUser)


export default router