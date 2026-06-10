import { Router } from "express"
import { getProducts,getProduct,addProduct,updateProduct,deleteProduct } from "../controllers/productsController.js"

const productRouter = Router()

//Rutas de productos 
productRouter.get("/",getProducts)
productRouter.get("/:id",getProduct)
productRouter.post("/",addProduct)
productRouter.put("/:id",updateProduct)
productRouter.delete("/:id",deleteProduct)

export {productRouter}