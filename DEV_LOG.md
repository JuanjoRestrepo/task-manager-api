📓 Development Log

## Approach

El proyecto fue desarrollado siguiendo una arquitectura por capas bien definida, aislando las preocupaciones del sistema en los siguientes niveles:

- **Routes:** Definición de puntos de entrada de la API.
- **Controllers:** Orquestación de peticiones y respuestas HTTP.
- **Services:** Contenedores de la lógica de negocio pura.
- **Repositories:** Abstracción del acceso a los datos.
- **Database:** Modelado y persistencia a través de Prisma.

Esta estructura no solo combate el código espagueti, sino que garantiza la mantenibilidad, escalabilidad y facilidad de pruebas del software a largo plazo.

---

## Key Decisions

### 1. Prisma como ORM

Elegido por su excelente soporte para TypeScript (Type safety), la inmejorable experiencia de desarrollo que provee y su potente CLI para gestionar migraciones sin fricción.

### 2. Autenticación JWT

Se optó por una autenticación basada puramente en tokens de estado (_stateless_). No requiere almacenamiento de sesiones en servidor, facilitando el escalado horizontal de la infraestructura.

### 3. Validación con AJV

Se utilizó validación basada en esquemas JSON (JSON Schema) para lograr una lógica de validación centralizada, desacoplada y con respuestas de error estandarizadas.

### 4. Docker para DB Local

Levantar PostgreSQL mediante contenedores de Docker asegura que cualquier miembro del equipo cuente exactamente con la misma consistencia de entorno y agiliza el setup inicial.

### 5. Render para el Deploy

Seleccionado por su extrema simplicidad para proyectos Node.js, su capa gratuita generosa y la integración nativa y transparente con PostgreSQL.

---

## Challenges & Solutions

### Prisma Migration Drift

- **Problema:** Desincronización entre el esquema de desarrollo y el estado real de la base de datos.
- **Solución:** Limpieza de la base de datos y reaplicación limpia de migraciones desde cero para unificar el historial.

### JWT Secret Missing

- **Problema:** Los inicios de sesión fallaban sistemáticamente al pasar a producción.
- **Solución:** Asegurar el correcto mapeo de las variables de entorno dentro de la interfaz de administración de Render.

### Swagger no disponible en producción

- **Problema:** Las rutas de configuración apuntaban por defecto a archivos fuente `.ts` (directorio `src`) en lugar del build compilado en JavaScript (`dist`).
- **Solución:** Se implementó una configuración dinámica de Swagger basada en la variable de entorno `NODE_ENV`.

### Errores de validación poco descriptivos

- **Solución:** Se optimizó el middleware para parsear los arrays de error de AJV y devolver estructuras JSON legibles al cliente, indicando puntualmente qué falló.

---

## What I Would Improve

- Añadir pruebas automatizadas con Jest y Supertest.
- Implementar flujo seguro de rotación de Refresh Tokens.
- Añadir control de acceso basado en roles.
- Integrar un sistema de logs profesional (ej. Winston o Pino).
- Automatizar el flujo de despliegue mediante un pipeline de CI/CD en GitHub Actions.

---

## Learnings

- La importancia crítica de la gestión dinámica de variables de entorno en producción.
- El correcto control del ciclo de vida de migraciones en un ORM moderno.
- Cómo estructurar el backend pensando en el crecimiento del producto.
- Entender la documentación interactiva de la API como un requerimiento funcional de primer nivel.
