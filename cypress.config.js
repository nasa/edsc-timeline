/* eslint-disable global-require */
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 1400,
  viewportHeight: 1100,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index')(on, config)
    },
    baseUrl: 'http://localhost:3011/#'
  }
})
