import jwt from "jsonwebtoken"

// Middleware para autenticar token cuando el usuario se loguea o registra
const authMiddleware = (req,res,next)=>{

    const header = req.headers.authorization

    if(!header || !header.startsWith("Bearer")){
         console.log("🚨 [AuthMiddleware Error]: No se recibió el encabezado Authorization válido.");
         return res.status(401).json({ 
            success: false,
            error: "Unauthorized" })
    }

    const token = header.split(" ")[1]

    try {
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.userLogged = decoded
        next()

    } catch (error) {
        res.status(401).json({ success: false, error: error.message })
    }
}

export {authMiddleware}