# Task Manager API

> **REST API** para la gestión de tareas con autenticación, construida con Node.js, Express, Prisma y PostgreSQL.

## 👨‍💻 Author

**Juan José Restrepo**

---

## Live Demo

- **API Base URL:** [https://task-manager-api-9ol6.onrender.com](https://task-manager-api-9ol6.onrender.com)
- **Swagger Docs:** [https://task-manager-api-9ol6.onrender.com/docs](https://task-manager-api-9ol6.onrender.com/docs)

---

## Tech Stack

| Tecnología     | Rol en el Proyecto                         |
| :------------- | :----------------------------------------- |
| **Node.js**    | Entorno de ejecución                       |
| **Express**    | Framework web para la API                  |
| **TypeScript** | Lenguaje para tipado estático y robustez   |
| **Prisma ORM** | Mapeo de base de datos y consultas         |
| **PostgreSQL** | Base de datos relacional (Neon Serverless) |
| **JWT**        | Autenticación basada en tokens             |
| **Swagger**    | Documentación bajo estándar OpenAPI        |

---

## Features

- **Autenticación:** Registro e inicio de sesión de usuarios con hashing de contraseñas (bcrypt).
- **Seguridad:** Rutas protegidas mediante JWT Bearer Tokens.
- **CRUD de Tareas:** Operaciones completas para gestionar tareas de usuario.
- **Validación estricta:** Validación de entradas mediante esquemas JSON con AJV.
- **Robustez:** Middleware centralizado para el manejo de errores.
- **Auto-documentada:** Documentación interactiva generada con Swagger.

---

## Quick Start (2 minutos)

1. Clona e instala:
   ```bash
   git clone https://github.com/JuanjoRestrepo/task-manager-api
   cd task-manager-api
   npm install
   ```
2. Crea tu `.env`:
   ```bash
   cp .env.example .env
   ```
3. Apunta `DATABASE_URL` a tu Postgres (local o remoto).
4. Migra la base:
   ```bash
   npx prisma migrate deploy
   ```
5. Levanta el server:
   ```bash
   npm run dev
   ```
6. Verifica:
   ```bash
   curl http://localhost:3000/health
   ```

---

## Authentication

La API utiliza **JWT Bearer Tokens** para proteger las rutas privadas.

### Ejemplo de Header:

```http
Authorization: Bearer <tu_token_aqui>
```

---

## API Endpoints

### Auth

- `POST /auth/register` - Registro de nuevos usuarios.
- `POST /auth/login` - Inicio de sesión y generación de token.

### Tasks (Protegidos 🔒)

- `GET /tasks` - Obtener todas las tareas del usuario.
- `POST /tasks` - Crear una nueva tarea.
- `PUT /tasks/:id` - Actualizar una tarea existente.
- `DELETE /tasks/:id` - Eliminar una tarea.

### Test

- `GET /test/protected` - Endpoint para verificar el estado de autenticación.

### Health

- `GET /health` - Verificación del estado de salud de la API.
- `GET /` - Alias simple de health (útil para Render).

---

## Example Requests

### 1. Registro de Usuario

```json
POST /auth/register
{
  "name": "Juan",
  "email": "juan@test.com",
  "password": "123456"
}
```

### 2. Login

```json
POST /auth/login
{
  "email": "juan@test.com",
  "password": "123456"
}
```

### 3. Crear Tarea (Requiere Token)

```json
POST /tasks
Authorization: Bearer TOKEN

{
  "title": "New task",
  "description": "Optional description"
}
```

---

## Quick API Check (curl)

1. Register:
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Juan","email":"juan@test.com","password":"123456"}'
   ```
2. Login:
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"juan@test.com","password":"123456"}'
   ```
3. Tasks (con token):
   ```bash
   curl -X GET http://localhost:3000/tasks \
     -H "Authorization: Bearer <TOKEN>"
   ```

---

## Setup Local

Sigue estos pasos para correr el proyecto localmente:

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/JuanjoRestrepo/task-manager-api
   cd task-manager-api
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar el entorno:**
   Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

   ```env
   PORT=3000
   # URL para desarrollo local (Docker)
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tasks_db?sslmode=disable"
   DIRECT_URL="postgresql://postgres:postgres@localhost:5432/tasks_db?sslmode=disable"

   # NOTA: Si usas Neon, usa las URLs de tu Dashboard (con ?pgbouncer=true en DATABASE_URL)

   JWT_SECRET=supersecret
   BASE_URL=http://localhost:3000
   NODE_ENV=development
   LOG_PRETTY=true
   ```

   Valores válidos para `NODE_ENV`: `development`, `test`, `production`.
   `LOG_PRETTY` es opcional (solo dev). Usa `false` para desactivar logs bonitos.

4. **Levantar base de datos (Docker):**

   ```bash
   docker run --name postgres-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
   ```

5. **Correr migraciones de Prisma:**

   ```bash
   npx prisma migrate dev
   ```

6. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

## Scripts

- `npm run dev` - desarrollo
- `npm run build` - compila a `dist`
- `npm start` - ejecuta `dist`
- `npm test` - tests
- `npm run test:coverage` - cobertura
- `npm run db:backup` - genera un backup SQL fechado en la carpeta `/backups`

---

## Swagger

- Local: `http://localhost:3000/docs`
- Producción: `https://task-manager-api-9ol6.onrender.com/docs`

---

## Deployment

La aplicación se encuentra desplegada en **Render** utilizando la siguiente infraestructura:

- **Web Service:** Para la aplicación Node.js (Render).
- **PostgreSQL:** Base de datos gestionada en **Neon (Serverless)** para mayor escalabilidad y persistencia.

```mermaid
graph LR
  subgraph Client_Side [User]
    A[Browser / Mobile]
  end

  subgraph Cloud_Infrastructure [Cloud Deployment]
    subgraph Render_Cloud [Render]
      B[Express API]
      C[Prisma Client]
    end

    subgraph Neon_Cloud [Neon Serverless]
      D{Connection Pooler}
      E[(PostgreSQL DB)]
    end
  end

  A -- HTTP/REST --> B
  B --> C
  C -- DATABASE_URL --> D
  D --> E
  C -- DIRECT_URL --> E
```

Variables de entorno configuradas en producción: `DATABASE_URL`, `JWT_SECRET`, `BASE_URL`, `NODE_ENV`.
Recomendado en Render: `NODE_ENV=production`.

### Production Checklist (Render)

- `NODE_ENV=production` (minúsculas)
- `DATABASE_URL` apuntando a tu instancia en **Neon** (asegúrate de usar el Pooler URL con `?pgbouncer=true`).
- `JWT_SECRET` robusto (>= 32 caracteres)
- `BASE_URL` con el dominio público del servicio
- `PORT` no es necesario setearlo en Render (lo inyecta automáticamente)
- `LOG_PRETTY` omitido o `false` (evita dependencias y overhead en producción)
- Asegura que el build instale `devDependencies` (requerido por TypeScript).
  Usamos `.npmrc` con `production=false` para evitar errores de tipos en Render.

---

## Database Optimization (Neon)

Para garantizar la estabilidad en un entorno Serverless con Neon, el proyecto utiliza una configuración de **doble endpoint**:

1.  **Pooled Connection (`DATABASE_URL`)**: Utiliza el pooler de Neon (`pgbouncer=true`). Es el que usa la aplicación en tiempo de ejecución para manejar múltiples conexiones concurrentes de forma eficiente.
2.  **Direct Connection (`DIRECT_URL`)**: Una conexión directa a la base de datos sin pasar por el pooler. Se utiliza exclusivamente para:
    - Ejecutar migraciones de Prisma (`prisma migrate`).
    - Realizar copias de seguridad (Backups) mediante `pg_dump`.

Esta configuración está centralizada en `prisma.config.ts` (Prisma 7+).

---

## Backups

El proyecto incluye un sistema de backups automatizado para prevenir la pérdida de datos:

- **Script**: `scripts/backup.ps1` (Windows) y `scripts/backup.sh` (Linux/Mac).
- **Ejecución**: `npm run db:backup`.
- **Almacenamiento**: Los archivos se guardan en la carpeta `/backups` con el formato `backup_YYYY-MM-DD_HH-mm-ss.sql`.
- **Seguridad**: La carpeta de backups está excluida de Git.

---

## Observability & Logging

La aplicación utiliza **Pino** para un logging estructurado de alto rendimiento:

- **HTTP Logger**: Cada solicitud es registrada con su ID único, método, URL y tiempo de respuesta.
- **Manejo de Errores**: Los errores se capturan de forma centralizada, registrando el stack trace y el ID de la solicitud para facilitar el debugging.
- **Pretty Print**: En entorno de desarrollo, los logs son legibles y coloreados para una mejor experiencia. En producción, se emiten en formato JSON crudo para una integración eficiente con sistemas de monitoreo (Datadog, Logtail, CloudWatch).

---

## Architecture

El backend sigue una **arquitectura por capas** limpia para separar responsabilidades:
`Routes → Controllers → Services → Repositories → Prisma`

Adicionalmente, se utilizan middlewares para resolver tareas transversales como la autenticación, validaciones de esquema y el control centralizado de excepciones.

```mermaid
flowchart TD
  A[Client / API Consumer] --> B[Express Routes]
  B --> C[Controllers]
  C --> D[Services (Business Logic)]
  D --> E[Repositories (Data Access)]
  E --> F[Prisma ORM]
  F --> G[(PostgreSQL)]

  X[Auth Middleware (JWT)] --- B
  Y[Validation Middleware (AJV)] --- B
  Z[Error Middleware (AppError)] --- B
```

---

## Security Notes

- Las contraseñas se encriptan de forma irreversible usando **bcrypt**.
- La comunicación y persistencia de sesión es _stateless_ a través de **JWT**.
- Los datos sensibles (como passwords) son omitidos intencionalmente en las respuestas HTTP.

---

## Improvements (Future Work)

- [ ] Implementación de **Refresh Tokens**.
- [ ] Control de acceso basado en roles (RBAC).
- [ ] Paginación y filtrado dinámico en endpoints de consulta.
- [ ] Cobertura de pruebas unitarias e integración (Jest + Supertest).
- [ ] Automatización con Pipelines de CI/CD.
