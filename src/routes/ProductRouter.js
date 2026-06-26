import { Router } from "express"
import { getProducts,getProduct,addProduct,updateProduct,deleteProduct } from "../controllers/productsController.js"
import { productSchema,updateProductSchema } from "../schemas/productValidation.js"
import { validateBody } from "../middlewares/validateMiddleware.js"

const ProductRouter = Router()

//Rutas de productos 
ProductRouter.get("/",getProducts)
ProductRouter.get("/:id",getProduct)
ProductRouter.post("/",validateBody(productSchema),addProduct)
ProductRouter.put("/:id",validateBody(updateProductSchema),updateProduct)
ProductRouter.delete("/:id",deleteProduct)

export {ProductRouter}