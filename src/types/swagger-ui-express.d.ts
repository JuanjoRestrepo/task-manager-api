declare module 'swagger-ui-express' {
  import { RequestHandler } from 'express';

  export const serve: RequestHandler[];
  export function setup(swaggerDoc?: object, ...args: unknown[]): RequestHandler;

  const swaggerUi: {
    serve: typeof serve;
    setup: typeof setup;
  };

  export default swaggerUi;
}
