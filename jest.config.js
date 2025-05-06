module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.{js,ts}'],
  collectCoverage: true,
  collectCoverageFrom: ['scripts.{js,ts}'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  verbose: true,
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  // Setting initial thresholds to match current coverage (0%)
  // These thresholds will be incrementally increased as part of other backlog items
  // that focus on improving test coverage and refactoring core logic
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};
