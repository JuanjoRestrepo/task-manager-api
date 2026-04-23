/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Carga variables de entorno automáticamente (.env.test recomendado)
  setupFiles: ['dotenv/config'],

  // Ubicación de tests
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).ts'],

  moduleFileExtensions: ['ts', 'js', 'json'],

  // Limpieza automática entre tests
  clearMocks: true,
  restoreMocks: true,

  // Evita tests colgados
  testTimeout: 10000,

  // Coverage (MUY valorado)
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts', // entrypoint
    '!src/tests/**', // tests no cuentan
  ],

  coverageReporters: ['text', 'lcov'],

  // Mock uuid (ESM) para Jest
  moduleNameMapper: {
    '^uuid$': '<rootDir>/src/tests/uuid.mock.ts',
  },

  // Manejo de teardown global (tu caso Prisma)
  globalTeardown: '<rootDir>/src/tests/jest.teardown.ts',

  // Mejora compatibilidad con TS moderno
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
