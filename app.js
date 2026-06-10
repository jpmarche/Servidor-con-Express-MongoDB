import express from "express"
import { connectDb } from "./src/config/mongoDbConnection.js"
import { productRouter } from "./src/routes/productRouter.js"
import { AuthRouter } from "./src/routes/AuthRouter.js"  
import {authMiddleware} from "./src/middlewares/authMiddleware.js"
import {config} from "dotenv"
import cors from "cors"

// ejecuta las variables de entorno
config()

let PORT= process.env.PORT || 3001

// inicializando servidor con express
const server = express()
server.use(cors()) 
server.use(express.json())

server.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"API REST con Mongo DB y Express"
    })
})

// Rutas
server.use("/products",authMiddleware,productRouter)
server.use("/auth",AuthRouter)

// inicializando el servidor y conexion a la base de datos
server.listen(PORT,()=>{
    console.log(`Servidor en escucha en http://localhost:${PORT}`)
    connectDb()
})
