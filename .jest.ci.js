const base = require('./jest.config');

module.exports = Object.assign({}, base, {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  reporters: ['default', 'jest-junit'],
});
