import swaggerJSDoc, {
  type Options as SwaggerJSDocOptions,
} from 'swagger-jsdoc';

const isProd = process.env.NODE_ENV === 'production';

const options: SwaggerJSDocOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'API for managing tasks with authentication',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [isProd ? 'dist/api/routes/*.js' : 'src/api/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
