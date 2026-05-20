export default {
  testEnvironment: 'node',
  transform: {}, // No transforms since we are running ESM natively via --experimental-vm-modules
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Handle ES imports with .js extension
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  verbose: true,
};
