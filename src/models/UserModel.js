import {model,Schema} from "mongoose"

// schema para usuarios
const userSchema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
  versionKey: false,
  timestamps: true
})

const User = model("User",userSchema)

export {User}