# Task Manager API 🚀
![CI](https://github.com/JuanjoRestrepo/task-manager-api/actions/workflows/ci.yml/badge.svg)

> **Production-Grade REST API** para la gestión de tareas con seguridad avanzada, monitoreo proactivo y arquitectura escalable. Construida con Node.js, Express, Prisma y PostgreSQL.

---

## 👨‍💻 Author
**Juan José Restrepo**

## Live Demo
- **API Base URL:** [https://task-manager-api-9ol6.onrender.com](https://task-manager-api-9ol6.onrender.com)
- **Swagger Docs:** [https://task-manager-api-9ol6.onrender.com/docs](https://task-manager-api-9ol6.onrender.com/docs)

---

## 🛡️ Hardened Security & RBAC
Esta API implementa un modelo de seguridad de "confianza cero":
- **Auth de 2 Capas**: Access Tokens (JWT cortos en memoria) y Refresh Tokens (rotación en base de datos y persistencia en `httpOnly` cookies).
- **Protección XSS/CSRF**: Los tokens de refresco nunca son accesibles por JavaScript en el cliente.
- **RBAC (Role-Based Access Control)**: Sistema de roles (`USER`, `ADMIN`) integrado en el esquema y middlewares de autorización.
- **Bcrypt**: Hashing de contraseñas con factor de coste ajustado para producción.

## 📊 Observability & Monitoring
- **Sentry Integration**: Monitoreo de errores en tiempo real y perfiles de rendimiento del servidor.
- **Structured Logging**: Logs en formato JSON (Pino) ideales para sistemas de agregación de logs (Datadog, CloudWatch).
- **Request Tracing**: ID único por solicitud (`requestId`) para rastrear errores desde el cliente hasta el log.

## ⚙️ Tech Stack
| Tecnología | Rol en el Proyecto |
| :--- | :--- |
| **Node.js 20+** | Entorno de ejecución de alto rendimiento |
| **Express 5** | Framework web moderno y minimalista |
| **TypeScript** | Robustez y tipado estático estricto |
| **Prisma ORM** | Capa de datos con motor de Rust nativo |
| **PostgreSQL** | Neon Serverless con Connection Pooling |
| **Sentry** | Monitoreo proactivo de excepciones |
| **Jest** | Pruebas de integración y cobertura de código |

---

## 🚀 Quick Start (Local Development)

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar el entorno:**
   Copia el archivo `.env.example` a `.env` y configura tus credenciales.
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/db"
   JWT_SECRET="tu_secreto_muy_largo"
   JWT_REFRESH_SECRET="otro_secreto_distinto"
   ```

3. **Sincronizar Base de Datos:**
   ```bash
   npx prisma db push
   ```

4. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```

---

## 🏗️ Architecture
El backend sigue una **arquitectura por capas** limpia:
`Routes → Controllers → Services → Repositories → Prisma`

```mermaid
flowchart TD
  A["Client"] --> B["Express Routes"]
  B --> C["Controllers"]
  C --> D["Services (Business Logic)"]
  D --> E["Repositories (Data Access)"]
  E --> F["Prisma ORM"]
  F --> G[("PostgreSQL (Neon)")]

  subgraph Middlewares
    X["Auth (JWT/Cookies)"]
    Y["RBAC (Roles)"]
    Z["Sentry (Monitoring)"]
  end
  X --- B
  Y --- B
  Z --- B
```

---

## 🛣️ API Endpoints

### Autenticación
- `POST /auth/register` - Registro de usuario.
- `POST /auth/login` - Login (genera JWT + Cookie de Refresco).
- `POST /auth/refresh` - Renueva el Access Token usando la Cookie.
- `POST /auth/logout` - Revoca el Refresh Token.

### Tareas (Protegidos 🔒)
- `GET /tasks` - Listar mis tareas.
- `POST /tasks` - Crear tarea.
- `PUT /tasks/:id` - Editar tarea.
- `DELETE /tasks/:id` - Eliminar tarea (Cascade delete habilitado).

---

## 🚀 Deployment (Render + Neon)
Para desplegar este proyecto, asegúrate de configurar las siguientes variables en Render:

1. **`DATABASE_URL`**: URL de Neon con `-pooler` y `?pgbouncer=true`.
2. **`DIRECT_URL`**: URL de Neon directa (sin `-pooler`).
3. **`JWT_SECRET`** & **`JWT_REFRESH_SECRET`**: Generados con `openssl rand -base64 32`.
4. **`SENTRY_DSN`**: Tu llave de cliente de Sentry.

**Build Command:** `npm install && npm run build`
**Start Command:** `npm start` (Ejecuta `db push` automáticamente antes de arrancar).

---

## 🧪 Testing
Contamos con una suite de pruebas automatizada con Jest y Supertest:
- **Ejecutar pruebas:** `npm test`
- **Cobertura:** `npm run test:coverage` (Objetivo: >80%)
