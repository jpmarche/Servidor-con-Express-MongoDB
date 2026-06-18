import { Router } from "express";
import { createUser,login,updateProfile,updatePassword,deleteAccount} from "../controllers/authControllers.js";
import {limiter} from "../middlewares/rateLimitMiddleware.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";

const AuthRouter = Router()

// Rutas de usuarios
AuthRouter.post("/register",createUser)
AuthRouter.post("/login",limiter,login)
// Nuevas rutas para actualizar o eliminar usuario (Requieren token válido)
AuthRouter.put("/update-profile", authMiddleware,updateProfile)
AuthRouter.put("/update-password", authMiddleware, updatePassword)
AuthRouter.delete("/delete-account",authMiddleware, deleteAccount)


export {AuthRouter}