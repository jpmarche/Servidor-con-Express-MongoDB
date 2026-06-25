import { z } from "zod";

// Define el esquema del producto
const productSchema = z.object({
  name: z.string({ required_error: "El nombre es obligatorio" })
    .min(2, "El nombre del producto debe tener al menos 2 caracteres")
    .max(20, "El nombre es demasiado largo"),

  price: z.number({ required_error: "El precio es obligatorio" })
    .positive("El precio debe ser un número mayor a 0"),

    category: z.enum([
    "Electrónica",
    "Almacenamiento",
    "Computación",
    "Periféricos",
    "Accesorios de Red",
    "Componentes de Hardware",
    "Sin categoria"
  ], {
      errorMap: () => ({ message: "Categoría inválida. Debe elegir una de las opciones permitidas." })
  }).default("Sin categoria"), // Si el cliente no manda este campo, Zod le pone "Sin categoria" 

  stock: z.number({ required_error: "El stock es obligatorio" })
    .int("El stock debe ser un número entero")
    .nonnegative("El stock no puede ser un número negativo")
});

export {productSchema}