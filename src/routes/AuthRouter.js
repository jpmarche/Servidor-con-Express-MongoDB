import { Router } from "express";
import { createUser,login } from "../controllers/authControllers.js";
import {limiter} from "../middlewares/rateLimitMiddleware.js"

const AuthRouter = Router()

// Rutas de usuarios
AuthRouter.post("/register",createUser)
AuthRouter.post("/login",limiter,login)

export {AuthRouter}