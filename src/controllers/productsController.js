import { Product } from "../models/ProductModel.js"


// Funcion para ver todos los productos registrados por el usuario logueado
const getProducts = async (req,res)=>{
    try {
        const userLogged = req.userLogged
        const {role,id} = userLogged
        let foundProducts
        if(role==="admin"){
            foundProducts = await Product.find()
        }else{
            foundProducts = await Product.find({userId: id})
        }
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
    const {id: userId, role} = req.userLogged
    const id = req.params.id
    const foundProduct = await Product.findById(id)
    
    if(!foundProduct){
        return res.status(404).json({
            success:false,
            message: "Product not found"
        })
    }
    if(userId === foundProduct.userId.toString() || role ==="admin"){
    return res.status(200).json({
        success:true,
        data: foundProduct,
    })}
    return res.status(403).json({
            success: false,
            message: "Access denied. You do not have permission to view this product."
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
    const {id:userId,role} = req.userLogged
    const body = req.body
    const foundProduct = await Product.findById(id)
     
    if(!foundProduct){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
      
    const updateData = {...body}
    if(body.stock !== undefined){
        updateData.available = body.stock > 0
    }
    
    
    if (userId !== foundProduct.userId.toString()  && role!=="admin" ){
        return res.status(404).json({
            success:false,
            message:"You are not authorized to update it"
        })}
    
        const updatedProduct = await Product.findByIdAndUpdate(
        {_id:id}, 
        {...updateData},
        {returnDocument:"after", projection:{userId:0},runValidators:true})

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
    const {id:userId,role} = req.userLogged
    const foundProduct = await Product.findById(id)

    if(!foundProduct){
         return res.status(404).json({
                success: false,
                message: "Product not found"
            })
    }

    if(userId !== foundProduct.userId.toString() && role !== "admin" ){
          return res.status(404).json({
                success: false,
                message: "You are not authorized to delete it"
            })
    }

    const deletedProduct= await Product.findByIdAndDelete(id)
    const publicData = deletedProduct.toObject()
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