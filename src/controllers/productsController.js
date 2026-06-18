import { Product } from "../models/ProductModel.js"


// Funcion para ver todos los productos registrados por el usuario logueado
const getProducts = async (req,res)=>{
    try {
       
        const userLogged = req.userLogged
        const foundProducts = await Product.find({userId:userLogged.id},{userId:0}) 
       
        res.status(200).json({
            success: true,
            data: foundProducts,
            message: "Products fetched successfully"
       })
} 
    catch (error) {
    res.status(500).json({ success: false, error: "Error fetching products" })
    }
}

// Funcion para ver un producto registrado por el usuario logueado
const getProduct = async(req,res)=>{
    try{
    const userLogged = req.userLogged
    const id = req.params.id
    const foundProduct = await Product.findOne({
        _id:id,
        userId:userLogged.id
    }, {userId:0})

    if(!foundProduct){
        return res.status(404).json({
            success:false,
            message: "Product not found or you are not authorized to see it"
        })
    }

    return res.status(200).json({
        success:true,
        data: foundProduct,
    })
}
    catch(error){
        return res.status(400).json({
            success:false,
            message: "Invalid ID format"
        })
    }
}

// Funcion para agregar un producto 
const addProduct = async (req,res) =>{
    try{
    
    const userLogged = req.userLogged
    const body = req.body

    const newProduct = new Product({
        name:body.name,
        price:body.price,
        category:body.category,
        stock:body.stock,
        available:body.stock > 0,
        userId: userLogged.id
    })
    
    await newProduct.save()
    const publicData = newProduct.toObject() 
    delete publicData.userId

    res.status(201).json({
        success: true,
        data: publicData,
        message: "Product created successfully"
    })
    }
    catch(error){
        res.status(500).json({
            success: false, 
            error: "Error creating product" 
        })
    }
   
}

// Funcion para modificar un producto registrado por el usuario logueado
const updateProduct = async (req,res) => {
    try{
    const id = req.params.id
    const userLogged = req.userLogged
    const body = req.body
    const updateData = {...body}
    if(body.stock !== undefined){
        updateData.available = body.stock > 0
    }

    const updatedProduct = await Product.findOneAndUpdate(
        {_id:id,userId:userLogged.id}, 
        {...updateData},
        {returnDocument:"after", projection:{userId:0},runValidators:true})

    if(!updatedProduct){
        return res.status(404).json({
            success:false,
            message:"Product not found or you are not authorized to update it"
        })
    }

    return res.status(200).json({
        success: true,
        data: updatedProduct,
        message: "Product updated successfully"
    })
}
    catch(error){
        res.status(400).json({ success: false, error: "Invalid ID format" })
    }
}

// Funcion para eliminar un producto registrado por el usuario logueado
const deleteProduct = async (req,res) => {
    
    try{
    const id = req.params.id
    const userLogged = req.userLogged

    const deleteProduct = await Product.findOneAndDelete({_id:id,userId:userLogged.id})
    
    if(!deleteProduct){
         return res.status(404).json({
                success: false,
                message: "Product not found or you are not authorized to delete it"
            })
    }

    const publicData = deleteProduct.toObject()
    delete publicData.userId
    
    return res.status(200).json({
        success:true,
        deletedProduct: publicData,
        message: "Product deleted successfully"
})
    }
    catch (error) {
        return res.status(400).json({ 
            success: false, 
            error: "Invalid ID format or server error" 
        })}
    }
export {getProducts,getProduct,addProduct,updateProduct,deleteProduct}