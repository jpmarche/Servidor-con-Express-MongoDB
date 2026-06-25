import { z } from "zod";

// Regex para contraseñas seguras
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;

// Esquema para Registro de Usuario (POST /auth/register)
const registerSchema = z.object({
  userName: z.string({ required_error: "El nombre de usuario es obligatorio" })
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(20, "El nombre de usuario no puede superar los 20 caracteres"),
    
  email: z.string({ required_error: "El correo electrónico es obligatorio" })
    .email("El formato de correo electrónico no es válido")
    .endsWith(".com", "Por favor, ingresa un correo electrónico válido que termine en .com"),
    
  password: z.string({ required_error: "La contraseña es obligatoria" })
    .regex(passwordRegex, "La contraseña debe contener al menos 8 caracteres, una mayúscula, un número y un carácter especial")
});

// Esquema para Inicio de Sesión (POST /auth/login)
const loginSchema = z.object({
  email: z.string({ required_error: "El correo electrónico es obligatorio" })
    .email("El formato de correo electrónico no es válido"),
    
  password: z.string({ required_error: "La contraseña es obligatoria" })
    .min(1, "La contraseña no puede estar vacía")
});

// Esquema para Actualizar el Perfil (Solo userName)
const updateProfileSchema = z.object({
  userName: z.string({ required_error: "El nombre de usuario es obligatorio" })
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(20, "El nombre de usuario no puede superar los 30 caracteres")
});

// Esquema para Actualizar la Contraseña
const updatePasswordSchema = z.object({
  currentPassword: z.string({ required_error: "La contraseña actual es obligatoria" })
    .min(1, "La contraseña actual no puede estar vacía"),
    
  newPassword: z.string({ required_error: "La nueva contraseña es obligatoria" })
    .regex(passwordRegex, "La nueva contraseña debe contener al menos 8 caracteres, una mayúscula, un número y un carácter especial")
});

export {registerSchema,loginSchema,updatePasswordSchema,updateProfileSchema}