import { Router } from "express";
import { createUser,login,updateProfile,updatePassword,deleteAccount} from "../controllers/authControllers.js";
import {limiter} from "../middlewares/rateLimitMiddleware.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { registerSchema,loginSchema, updateProfileSchema, updatePasswordSchema } from "../schemas/userValidation.js";
import { validateBody } from "../middlewares/validateMiddleware.js";

const AuthRouter = Router()

// Rutas de usuarios
AuthRouter.post("/register",validateBody(registerSchema),createUser)
AuthRouter.post("/login",validateBody(loginSchema),limiter,login)
// Nuevas rutas para actualizar o eliminar usuario (Requieren token válido)
AuthRouter.put("/update-profile",authMiddleware,validateBody(updateProfileSchema),updateProfile)
AuthRouter.put("/update-password",authMiddleware,validateBody(updatePasswordSchema), updatePassword)
AuthRouter.delete("/delete-account",authMiddleware, deleteAccount)


export {AuthRouter}