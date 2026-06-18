import { User } from "../models/UserModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Product } from "../models/ProductModel.js"

// Funcion para registrar un nuevo usuario
const createUser = async (req,res) =>{
    try {
    
    const {userName,email,password} = req.body
    
    const foundUser = await User.findOne({email})
        if (foundUser) {
      return res.status(409).json({ success: false, error: "Conflict, user already exists" })
    }
    
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/
    if (!regex.test(password)) {
      return res.status(400).json({ success: false, error: "Invalid password. It must contain at least 8 characters, one uppercase letter, one number, and one special character." })
    }
    
    const hashPassword = await bcrypt.hash(password,10)

    
    const newUser = new User({
        userName,
        email,
        password:hashPassword
    })

    await newUser.save()
      // generar token
      const payload = { id: newUser._id, email: newUser.email, userName: newUser.userName }
      const secretKey = process.env.JWT_SECRET
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" })
    
      const userObject = newUser.toObject()
      delete userObject.password

    return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userObject,
            token:token
    } )
    }
    catch (error) {
    res.status(500).json({
        success:false,
        message: "Error registering user",
        error:error.message

    })    
    }
    
 }

//  Funcion para loguearse
 const login = async (req,res) =>{
   try{ 
    const {email,password} = req.body
    if(!email || !password){
     return res.status(400).json({
        success:false,
        message: "The required email or password was not submitted.",
     }) 
    }

    const foundUser =await User.findOne({email})

         if (foundUser){
            const validPassword = await bcrypt.compare(password,foundUser.password)  
            if (validPassword){
                // Generar Token
                const payload = {id:foundUser._id,email:foundUser.email,userName:foundUser.userName}
                const secretKey = process.env.JWT_SECRET
                const token = jwt.sign(payload,secretKey,{expiresIn:"1h"})

               return res.status(200).json({
                success: true,
                message: "Login successful",
                token: token    
            })
         }}
    
        return  res.status(401).json({
        success:false,
        message: "Invalid email or password. "
        
     }) }
     
     
     catch (error) {
    res.status(500).json({ success: false, error: "An internal server error occurred while logging in." })
  }
 
    }
    // Funcion para actualizar el perfil (Solo permite cambiar el userName)
const updateProfile = async (req, res) => {
  try {
    const userLogged = req.userLogged // Tu authMiddleware ya inyecta esto
    const { userName } = req.body

    if (!userName) {
      return res.status(400).json({ success: false, message: "El nombre de usuario es requerido." })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userLogged.id,
      { userName },
      { new: true, projection: { password: 0 } } // Devolvemos el usuario sin la contraseña
    )

    // Generamos un nuevo token con el userName actualizado para que el front lo actualice
    const payload = { id: updatedUser._id, email: updatedUser.email, userName: updatedUser.userName }
    const secretKey = process.env.JWT_SECRET
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" })

    return res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente.",
      data: updatedUser,
      token: token
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar el perfil." })
  }
}
// Funcion para cambiar la contraseña desde el perfil
const updatePassword = async (req, res) => {
  try {
    const userLogged = req.userLogged
    const userId = userLogged?.id

    if (!userId) {
      return res.status(401).json({ success: false, message: "No autorizado." })
    }

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "La contraseña actual y la nueva son requeridas." })
    }

    // 1. Buscamos al usuario en la base de datos para obtener su password hasheado
    const foundUser = await User.findById(userId)
    if (!foundUser) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado." })
    }

    // 2. Verificamos si la contraseña actual que ingresó es correcta
    const isValidPassword = await bcrypt.compare(currentPassword, foundUser.password)
    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: "La contraseña actual es incorrecta." })
    }

    // 3. Validamos que la nueva contraseña cumpla con tu expresión regular estricta
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/
    if (!regex.test(newPassword)) {
      return res.status(400).json({ 
        success: false, 
        message: "Nueva contraseña inválida. Debe contener al menos 8 caracteres, una mayúscula, un número y un carácter especial." 
      })
    }

    // 4. Hasheamos la nueva contraseña y la guardamos
    const hashPassword = await bcrypt.hash(newPassword, 10)
    foundUser.password = hashPassword
    await foundUser.save()

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada exitosamente."
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar la contraseña.", error: error.message })
  }
}


// Funcion para eliminar permanentemente el usuario y sus productos
const deleteAccount = async (req, res) => {
  try {
    const userLogged = req.userLogged
    const userId = userLogged?.id || userLogged?._id

    // 1. Eliminamos primero todos los productos que le pertenecen a este usuario
    // (Asumiendo que importas el modelo Product en este archivo)
    await Product.deleteMany({ userId: userId })

    // 2. Eliminamos al usuario de la base de datos
    await User.findByIdAndDelete(userLogged.id)

    return res.status(200).json({
      success: true,
      message: "Cuenta e inventario eliminados permanentemente."
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar la cuenta." })
  }
}


export { createUser, login, updateProfile, updatePassword,deleteAccount }
