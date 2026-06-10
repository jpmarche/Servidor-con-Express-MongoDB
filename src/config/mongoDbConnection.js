// import mongoose from "mongoose"
// import { config } from "dotenv"

// config()
// // conexion a mongo DB
// const connectDb = async ()=>{
// try {
//     await mongoose.connect(process.env.URI_DB)
//     console.log("conectado a Mongo DB ✅")
// }
//  catch (error) {
//     console.log("No se pudo conectar a la base de datos❌",error.message)
// }}

// export {connectDb}

import mongoose from "mongoose"
import { config } from "dotenv" // <--- Agrega este import obligatoriamente

// Forzamos a leer el entorno del sistema
config() 

export const connectDb = async () => {
    // Si process.env.MONGO_URI está vacío por algún motivo, este console.log te avisará en Render
    console.log("URI recibida del sistema:", process.env.MONGO_URI ? "Detectada correctamente" : "¡VIENE VACÍA!");
    
    // Conectamos usando estrictamente la variable de entorno exigida por la consigna
    return await mongoose.connect(process.env.MONGO_URI)
}