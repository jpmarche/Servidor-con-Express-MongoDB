import { Product } from "../models/ProductModel.js"


// Funcion para ver todos los productos registrados por el usuario logueado
const getProducts = async (req, res) => {
    try {
        const { role, id } = req.userLogged;

        // Ver lo que pide el usuario (?page, ?limit, ?sort, ?filter)
        const { page = 1, limit = 10, sort, filter } = req.query;

        // Comprobar Role
        let queryFilters = {};
        if (role !== "admin") {
            queryFilters.userId = id;
        }

        // FILTER--- ?filter=category:Electrónica
        if (filter) {
            // Separa el texto 'category:food' en campo -> 'category' y valor -> 'food'
            const [campo, valor] = filter.split(':');
            
            // Añade dinámicamente el filtro (ej: queryFilters.category = "Electrónica")
            queryFilters[campo] = valor; 
        }

        // SORT--- ?sort=asc o ?sort=desc (Ordenamiento)
        let sortOptions = {};
        if (sort) {
            //  'asc' (1) o 'desc' (-1)
            sortOptions.name = sort === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = -1; // Orden por defecto si no envían nada
        }

        // PAGE (?page=1&limit=10)
        const pageNumber = Math.max(1, parseInt(page));
        const limitNumber = Math.max(1, parseInt(limit));
        const skip = (pageNumber - 1) * limitNumber; // Cuántos productos saltarse

        // Buscar el producto en la base de datos
        const [foundProducts, totalProducts] = await Promise.all([
            Product.find(queryFilters)
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNumber),
            Product.countDocuments(queryFilters)
        ]);

        // Respuesta al usuario
        res.status(200).json({
            success: true,
            pagination: {
                totalItems: totalProducts,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalProducts / limitNumber),
                itemsPerPage: limitNumber
            },
            data: foundProducts,
            message: "Products fetched successfully"
        });
    } 
    catch (error) {
        res.status(500).json({ success: false, error: "Error fetching products" });
    }
};


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
      
    const updateData = {
            name: body.name || foundProduct.name,
            description: body.description || foundProduct.description,
            price: body.price !== undefined ? body.price : foundProduct.price,
            stock: body.stock !== undefined ? body.stock : foundProduct.stock,
            image: body.image || foundProduct.image,
            category: body.category || foundProduct.category
        };
    if(body.stock !== undefined){
        updateData.available = body.stock > 0
    }
    
    
    if (userId !== foundProduct.userId.toString()  && role!=="admin" ){
        return res.status(401).json({
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