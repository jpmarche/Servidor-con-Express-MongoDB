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

## 🛠️ Requisitos Técnicos e Instalación Local

### Tecnologías Necesarias
- **Node.js** 
- **MongoDB** (Instancia local o clúster en MongoDB Atlas)

### Pasos para la Configuración Local

1. **Clonar el proyecto e instalar las dependencias necesarias:**
   ```bash
   npm install
   ```

2. **Configurar las Variables de Entorno:**
   Crea un archivo `.env` en la raíz del proyecto basándote en el archivo de ejemplo `.env.example`.
   ```env
   PORT=3001
   MONGO_URI=tu_cadena_de_conexion_de_mongodb
   JWT_SECRET=tu_palabra_secreta_super_segura
   ```

3. **Ejecutar el Servidor:**
     ```bash
     npm run dev

---

## ☁️ Despliegue en la Nube (Render)

El proyecto cuenta con un deploy completamente funcional listo para producción. 

- **URL Base de Producción**: `https://servidor-con-express-mongodb.onrender.com`

## 📂 Estructura del Proyecto (Arquitectura MVC)

La arquitectura modular separa de manera estricta las responsabilidades del sistema:
```text
├── src/
│   ├── config/             # Configuración y conexión asíncrona a la base de datos
│   ├── middlewares/        # Middlewares de control de acceso y seguridad (JWT)
│   ├── models/             # Esquemas de Mongoose (User, Product)
│   ├── controllers/        # Lógica de negocio para Autenticación y Productos
│   ├── routes/             # Enrutadores que dirigen las peticiones HTTP
├── app.js                  # Archivo de entrada, inicialización de Express y variables globales
├── package.json            # Archivo de configuracion .json
├── .env.example            # Plantilla de variables de entorno requeridas
├── coleccion_pruebas.json  # Archivo de la colección de pruebas exportado (Postman)
└── README.md               # Documentación general del proyecto
```

---

## 🛣️ Endpoints de la API

### 🔐 Autenticación (Públicos)
- **POST** `/auth/register` → Crea un nuevo usuario y devuelve el token JWT de acceso directo.
- **POST** `/auth/login` → Valida credenciales encriptadas y devuelve el token JWT.

### 📦 Entidad Protegida: Productos (Privados)
*Requiere incluir la cabecera `Authorization: Bearer <TOKEN_JWT>` en la petición.*
- **GET** `/products` → Lista exclusivamente los productos pertenecientes al usuario autenticado.
- **GET** `/products/:id` → Devuelve los detalles de un producto específico (si pertenece al usuario).
- **POST** `/products` → Crea un producto vinculándolo automáticamente al `userId` del usuario logueado.
- **PUT** `/products/:id` → Modifica un producto de forma total o parcial (si pertenece al usuario).
- **DELETE** `/products/:id` → Remueve de manera permanente el producto (si pertenece al usuario solicitante).

---

## 📝 Ejemplos de Peticiones (JSON)

### Registro de Usuario (`POST /auth/register`)
**Cuerpo (Body):**
```json
{
  "userName": "Juan Perez",
  "email": "juan@example.com",
  "password": "Password123!"
}
```

### Crear Producto (`POST /products`)
**Cuerpo (Body):**
```json
{
  "name": "Teclado Mecánico RGB",
  "price": 85.50,
  "category": "Electrónica",
  "stock": 15
}
```

---

## 🧪 Instrucciones para Ejecutar la Colección de Pruebas (Postman)

El proyecto incluye el archivo `coleccion_pruebas.json` en la raíz, completamente configurado y automatizado con variables dinámicas para facilitar la evaluación.

### Pasos para probar la API en Vivo:
1. Abre **Postman** (aplicación de escritorio o cliente web).
2. Haz clic en el botón **Import** (Importar) y selecciona el archivo `coleccion_pruebas.json`.
3. Haz clic sobre el nombre de la colección importada (`Proyecto Backend MVC`) y dirígete a la pestaña **Variables**.
4. En el campo **Current Value** de la variable `base_url`, puedes elegir qué servidor testear:
   - **Para probar en la nube (Ya configurado por defecto)**: Deja la URL de Render (`https://servidor-con-express-mongodb.onrender.com`).
   - **Para probar de forma local**: Cambia el valor por `http://localhost:3001` *(asegúrate de encender tu servidor local antes y de usar el "Desktop Agent" de Postman si estás en la versión web)*.
5. Haz clic en **Save** (Guardar cambios).
6. **Ejecuta las peticiones en orden secuencial**:
   - Corre `1. Registrar Usuario` (con un correo nuevo) o `2. Login Usuario`. Los scripts internos de Postman capturarán la respuesta del servidor y **almacenarán automáticamente el Token JWT** en las variables internas.
   - Corre `3. Crear Producto`. La ruta privada heredará el token sola y, tras crear el elemento, **guardará el ID dinámico del producto**.
   - Corre los endpoints restantes (`GET por ID`, `PUT`, `DELETE`). Todos leerán las variables dinámicas de forma automática sin necesidad de copiar y pegar códigos de MongoDB de manera manual.
