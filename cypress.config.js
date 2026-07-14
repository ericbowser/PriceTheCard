const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:42000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    setupNodeEvents(on, config) {},
  },
  video: true,
  videoCompression: 15,
  viewportWidth: 1440,
  viewportHeight: 900,
  defaultCommandTimeout: 12000,
  pageLoadTimeout: 30000,
})
