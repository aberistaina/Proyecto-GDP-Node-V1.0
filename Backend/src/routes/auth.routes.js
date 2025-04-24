import { Router } from "express";
import { createUser, login, forgotPassword, changePassword } from "../controllers/auth.controller.js";
import { issueTokenMiddleware, verifyTokenMiddleware } from "../middlewares/login.middleware.js";


const router = Router()

router.post("/register", createUser)
router.post("/login", issueTokenMiddleware, login)
router.post("/recover-password", forgotPassword)
router.post("/change-password", verifyTokenMiddleware, changePassword)


export default router