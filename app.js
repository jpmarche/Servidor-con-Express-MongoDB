import express from "express"
import { connectDb } from "./src/config/mongoDbConnection.js"
import { ProductRouter } from "./src/routes/ProductRouter.js"
import { AuthRouter } from "./src/routes/AuthRouter.js"  
import { authMiddleware } from "./src/middlewares/authMiddleware.js"
import { config } from "dotenv"
import cors from "cors"
import { User } from "./src/models/UserModel.js"
import bcrypt from "bcrypt"

// ejecuta las variables de entorno
config()

let PORT = process.env.PORT || 3001

// inicializando servidor con express
const server = express()
server.use(cors()) 
server.use(express.json())

server.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API REST con Mongo DB y Express"
    })
})

// Rutas
server.use("/products", authMiddleware, ProductRouter)
server.use("/auth", AuthRouter)

// FUNCIÓN PARA CREAR AL ADMINISTRADOR ÚNICO SI NO EXISTE
const seedAdmin = async () => {
    try {
        // Busca si ya existe algún usuario con el rol de admin
        const adminExists = await User.findOne({ role: "admin" })
        
        if (!adminExists) {
            console.log("⏳ No se encontró un administrador. Creando uno nuevo...")
            
            // Hashea la contraseña que vendrá desde el .env
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin123!", 10)
            
            await User.create({
                userName: process.env.ADMIN_NAME || "Super Admin",
                email: process.env.ADMIN_EMAIL || "admin@correo.com",
                password: hashedPassword,
                role: "admin" // Fuerza el rol de administrador en la base de datos
            })
            
            console.log("🚀 Administrador único inicializado con éxito.")
        } else {
            console.log("✅ El administrador ya existe en la base de datos.")
        }
    } catch (error) {
        console.error("❌ Error al inicializar el administrador:", error.message)
    }
}

// inicializando el servidor y conexion a la base de datos
server.listen(PORT, async () => {
    console.log(`Servidor en escucha en http://localhost:${PORT}`)
    
    // Conecta de forma asíncrona a MongoDB
    await connectDb()
    
    // Ejecuta la validación/creación del administrador único
    await seedAdmin()
})
