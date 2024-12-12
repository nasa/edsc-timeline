module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: '22',
          esmodules: true
        }
      }
    ],
    '@babel/preset-react'
  ],
  env: {
    test_cypress: {
      plugins: ['istanbul']
    }
  },
  sourceType: 'unambiguous',
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    'transform-class-properties'
  ]
}
