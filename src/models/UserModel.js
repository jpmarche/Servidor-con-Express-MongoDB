import {model,Schema} from "mongoose"

// schema para usuarios
const userSchema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true,  
      // REGEX: Valida la estructura clásica de email obligando a terminar en .com
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/, 'Por favor, ingresa un correo electrónico válido que termine en .com']
  },
    password: { type: String, required: true }
}, {
  versionKey: false,
  timestamps: true
})

const User = model("User",userSchema)

export {User}