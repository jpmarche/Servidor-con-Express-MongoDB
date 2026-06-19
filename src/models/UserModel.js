import {model,Schema} from "mongoose"

// schema para usuarios
const userSchema = new Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
    },
    // Agregar rol para tener usuario Admin
    role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' // Por defecto todos son usuarios normales
  }
}, {
  versionKey: false,
  timestamps: true
})

const User = model("User",userSchema)

export {User}