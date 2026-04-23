declare module 'swagger-jsdoc' {
  export interface Options {
    definition?: Record<string, unknown>;
    apis?: string[];
    [key: string]: unknown;
  }

  const swaggerJSDoc: (options?: Options) => Record<string, unknown>;
  export default swaggerJSDoc;
}
