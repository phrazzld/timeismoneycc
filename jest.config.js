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
};
