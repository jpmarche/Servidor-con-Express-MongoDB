# Servidor Backend: Express + MongoDB + Autenticación (JWT) + Arquitectura MVC

Este proyecto consiste en un servidor backend desarrollado con **Express** y **MongoDB (Mongoose)**. Implementa un sistema completo de autenticación basado en **JSON Web Tokens (JWT)** y sigue rigurosamente el patrón de diseño **MVC (Modelo-Vista-Controlador)**. Permite gestionar de manera segura usuarios y una entidad privada de **Productos** asociada directamente a cada usuario autenticado.

---

## 🎯 Objetivos del Proyecto
- **Integración Eficiente**: Conexión entre Express y MongoDB mediante Mongoose.
- **Arquitectura Modular**: Implementación limpia del patrón MVC, separando rutas, controladores y modelos.
- **Seguridad Avanzada**: Autenticación mediante hashing de contraseñas con `bcrypt` y firma de tokens con `JWT`.
- **Control de Acceso**: Endpoints protegidos mediante middlewares especializados para la verificación de identidad.
- **Manejo de Errores**: Respuestas de servidor consistentes ante formatos de ID inválidos o accesos no autorizados.

---

## 🛠️ Requisitos Técnicos e Instalación

### Tecnologías Necesarias
- **Node.js** (Versión 16 o superior)
- **MongoDB** (Instancia local o clúster en MongoDB Atlas)

### Pasos para la Configuración Local

1. **Clonar el proyecto e instalar las dependencias necesarias:**
   ```bash
   npm install
   ```

2. **Configurar las Variables de Env:**
   Crea un archivo `.env` en la raíz del proyecto basándote en el archivo de ejemplo `.env.example`.
   ```env
   PORT=3001
   MONGO_URI=tu_cadena_de_conexion_de_mongodb
   JWT_SECRET=tu_palabra_secreta_super_segura
   ```

3. **Ejecutar el Servidor:**:
     ```bash
     npm run dev

---

## 📂 Estructura del Proyecto (Arquitectura MVC)

La arquitectura modular separa de manera estricta las responsabilidades del sistema:

La arquitectura modular separa de manera estricta las responsabilidades del sistema:
```text
├── src/
│   ├── config/             # Configuración y conexión a la base de datos
│   ├── middlewares/        # Middlewares de control de acceso y seguridad (JWT)
│   ├── models/             # Esquemas de Mongoose (User, Product)
│   ├── controllers/        # Lógica de control para Autenticación y Productos
│   ├── routes/             # Enrutadores que dirigen las peticiones HTTP
│
├── package.json
|── app.js                  # Inicialización del servidor Express y middlewares base
├── .env.example            # Plantilla de variables de entorno requeridas
├── coleccion_pruebas.json  # Archivo de pruebas exportado (Thunder Client)
└── README.md               # Documentación general del proyecto
```


## 🛣️ Endpoints de la API

### 🔐 Autenticación (Públicos)
- **POST** `/auth/register` → Registra un nuevo usuario en la base de datos (valida fortaleza de contraseña y correos duplicados). Devuelve el token de acceso.
- **POST** `/auth/login` → Compara credenciales encriptadas. Devuelve el token JWT.

### 📦 Entidad Protegida: Productos (Privados)
*Requiere incluir la cabecera `Authorization: Bearer <TOKEN_JWT>` en la petición.*
- **GET** `/products` → Lista exclusivamente los productos pertenecientes al usuario autenticado.
- **GET** `/products/:id` → Devuelve los detalles de un producto específico (siempre que pertenezca al usuario).
- **POST** `/products` → Crea un producto vinculándolo automáticamente al `userId` del usuario logueado.
- **PUT** `/products/:id` → Modifica un producto. Actualiza el estado de disponibilidad automáticamente si se altera el stock.
- **DELETE** `/products/:id` → Remueve de manera permanente el producto si pertenece al usuario solicitante.

---

## 📝 Ejemplos de Peticiones y Respuestas (JSON)

### 1. Registro de Usuario (`POST /auth/register`)
**Cuerpo de la Petición (Body):**
```json
{
  "userName": "Juan Perez",
  "email": "juan@example.com",
  "password": "Password123!"
}
```
**Respuesta Exitosa (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "64b0f1b2c...",
    "userName": "Juan Perez",
    "email": "juan@example.com"
  }
}
```

### 2. Inicio de Sesión (`POST /auth/login`)
**Cuerpo de la Petición (Body):**
```json
{
  "email": "juan@example.com",
  "password": "Password123!"
}
```
**Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Crear Producto (`POST /products`)
*Cabecera obligatoria: `Authorization: Bearer <TOKEN>`*
**Cuerpo de la Petición (Body):**
```json
{
  "name": "Teclado Mecánico RGB",
  "price": 85.50,
  "category": "Electrónica",
  "stock": 15
}
```
**Respuesta Exitosa (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "65cd38f1a...",
    "name": "Teclado Mecánico RGB",
    "price": 85.50,
    "category": "Electrónica",
    "stock": 15,
    "available": true
  }
}
```

---

## 🧪 Colección de Pruebas

El proyecto incluye el archivo `coleccion_pruebas.json` listo para ser entregado e importado directamente en **Postman**.

### Instrucciones para probar con Postman:
1. Abre la aplicación de Postman o su versión web.
2. Haz clic en el botón **Import** ubicado en la barra lateral o parte superior.
3. Arrastra o selecciona el archivo `coleccion_pruebas.json` presente en la raíz de este proyecto.
4. Asegúrate de tener corriendo tu servidor local (`npm run dev` en el puerto 3001).
5. Las variables de entorno URL, Token JWT e IDs de Producto están automatizadas mediante scripts de post-respuesta dentro de la propia colección. Ejecuta las peticiones de forma secuencial.
