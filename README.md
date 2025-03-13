# 🛒 E-commerce Backend Architecture Structure

## 📌 Descripción
Este proyecto es una estructura de backend para una plataforma de e-commerce desarrollada con **Node.js** ⚡ y **NestJS** 🚀. Incluye 🔑 autenticación de usuarios, 🔐 protección de rutas, 🗄️ gestión de base de datos con **PostgreSQL** 🐘 y **TypeORM**, 🛍️ creación de órdenes y 📤 subida de archivos de imagen para los productos utilizando **Cloudinary** ☁️.

> **📢 Nota:** Este proyecto fue desarrollado como parte del proyecto final de backend para el bootcamp intensivo de Full Stack Development en **SoyHenry** 🎓.

---

## 🛠️ Tecnologías utilizadas

- **Node.js** ⚡
- **NestJS** 🚀
- **PostgreSQL** 🐘
- **TypeORM** 🏛️
- **Cloudinary** ☁️ (para almacenamiento de imágenes)
- **Swagger** 📜 (para documentación de API)
- **JWT (JSON Web Tokens)** 🔑 (para autenticación)
- **bcrypt** 🔒 (para encriptación de contraseñas)
- **Docker** 🐳 (para despliegue y contenedorización)

---

## ⚙️ Instalación y Ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/Lc1cL/e-commerce-backend-architecture-structure.git
cd e-commerce-backend-architecture-structure
```

### 2️⃣ Instalar dependencias
```bash
 npm install
```

### 3️⃣ Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
PORT=your_local_port

DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_HOST=your_database_localhost
DB_PORT=your_database_port

DATABASE_URL=your_database_url

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

JWT_SECRET=claveSecreta
```

### 4️⃣ Ejecutar la aplicación en desarrollo
```bash
 npm run start:dev
```

### 5️⃣ Ejecutar la aplicación en producción
```bash
 npm run build
 npm run start:prod
```

### 6️⃣ Ejecutar con Docker 🐳
Si deseas utilizar Docker, simplemente corre el siguiente comando:
```bash
 docker-compose up --build
```

---

## 📖 Documentación de la API
La documentación de la API está disponible a través de **Swagger** 📜. Puedes acceder a ella una vez la aplicación esté corriendo en:
```
http://localhost:3000/api
```
Allí podrás ver todos los 🔗 endpoints disponibles, sus 📋 descripciones y 📌 requisitos, así como las 🛡️ rutas protegidas o exclusivas para administradores.

---

## 🔗 Endpoints Principales
Todos los endpoints están documentados en Swagger, pero aquí tienes un resumen de los más importantes:

- **🔑 Autenticación**
  - `POST /auth/signin` - Iniciar sesión
  - `POST /auth/signup` - Registrar usuario

- **🛍️ Productos**
  - `GET /products` - Obtener productos
  - `GET /products/:id` - Obtener producto por id delproducto
  - `GET /products/seeder` - Activa el seeder de productos (Admin)
  - `PUT /users/:id` - Actualizar información de un producto por su id (Admin)
  - `DELETE /users/:id` - Eliminar todos los productos (Admin)
  - `DELETE /users/:id` - Eliminar información de un producto por su id (Admin)

- **📦 Órdenes**
  - `GET /orders/:id` - Obtener órden del usuario por id de órden
  - `POST /orders` - Crear una nueva orden

- **👤 Usuarios**
  - `GET /users` - Obtener información de usuarios (Admin)
  - `GET /users/:id` - Obtener información de un usuario por su id
  - `PUT /users/:id` - Actualizar información de un usuario por su id
  - `DELETE /users/:id` - Eliminar información de un usuario por su id
- **🗃️ Categorias**
  - `GET /categories` - Obtener todas las categorias disponibles
  - `Get /catgeories/seeder`- Activa el seeder de productos (Admin)
- **🖼️ File**
  - `POST /files/uploadImages/:id` - Subir una imagen para un producto con id del producto
---

## 🚀 Despliegue
El backend está desplegado y disponible en el siguiente enlace:
[**🌍 Enlace al Deploy**](https://e-commerce-backend-architecture-production.up.railway.app/api#/)

Puedes probarlo directamente desde **Swagger** en el mismo enlace.

---

## 🤝 Contribución
Este es un proyecto académico, por lo que no está abierto a contribuciones externas.

---

## 📜 Licencia
Este proyecto no cuenta con una licencia.

---

### ✨ Autor
**Lola Campos** - Full-Stack Developer

**💼 LinkedIn**: [linkedin.com/in/campos-lola/]([https://linkedin.com/in/lolacampos](https://www.linkedin.com/in/campos-lola/))
