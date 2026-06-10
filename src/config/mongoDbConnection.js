import mongoose from "mongoose"

// conexion a mongo DB
const connectDb = async ()=>{
try {
    await mongoose.connect(process.env.URI_DB)
    console.log("conectado a Mongo DB ✅")
}
 catch (error) {
    console.log("No se pudo conectar a la base de datos❌",error.message)
}}

export {connectDb}