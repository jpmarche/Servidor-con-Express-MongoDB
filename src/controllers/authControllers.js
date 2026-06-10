import { User } from "../models/UserModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
export {createUser,login}