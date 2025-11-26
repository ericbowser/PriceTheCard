/** @type {import('jest').Config} */
const config = {
  verbose: true,
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testEnvironment: 'jsdom',
};

module.exports = config;