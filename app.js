import express from "express"
import { connectDb } from "./src/config/mongoDbConnection.js"
import { productRouter } from "./src/routes/productRouter.js"
import { AuthRouter } from "./src/routes/AuthRouter.js"  
import { authMiddleware } from "./src/middlewares/authMiddleware.js"
import { config } from "dotenv"
import cors from "cors"

// Ejecuta las variables de entorno
config()

const PORT = process.env.PORT || 3001

// Inicializando servidor con express
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
server.use("/products", authMiddleware, productRouter)
server.use("/auth", AuthRouter)

// === ARRANQUE SEGURO Y ASÍNCRONO ===
const startServer = async () => {
    try {
        console.log("Conectando a MongoDB Atlas...")
        
        // Obliga al sistema a esperar a que conecte la base de datos
        await connectDb() 
        console.log("Conexión a MongoDB Atlas establecida con éxito.✅")

        // Una vez conectada, recién ahí abrimos el puerto para recibir peticiones
        server.listen(PORT, () => {
            console.log(`Servidor en escucha en el puerto ${PORT}`)
        })
    } catch (error) {
        console.error("Error crítico al iniciar el servidor:❌", error.message)
        process.exit(1) // Detiene la app si la base de datos falla
    }
}

startServer()
