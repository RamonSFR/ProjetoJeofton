/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.integration.test.ts'],
  preset: 'ts-jest',
  clearMocks: true,
  restoreMocks: true,
  moduleFileExtensions: ['ts', 'js', 'json'],
};
