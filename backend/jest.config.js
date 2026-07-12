/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', 'test/routes/', 'test/setup.test.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/config/',
    'src/controllers/',
    'src/middlewares/',
    'src/routes/',
    'src/utils/',
  ],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  maxWorkers: 1,
};
