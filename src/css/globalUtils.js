// Any files referenced in the resources array will be included in each component.
// Only import variables, functions, etc so css is not duplicated. The variables included
// here will be available in all sass files included by Webpack.

const path = require('path')

const resources = [
  'vendor/bootstrap/_variables.scss',
  '_variables.scss'
]

module.exports = resources.map((file) => path.resolve(__dirname, file))
