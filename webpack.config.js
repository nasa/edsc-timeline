const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src/index.js'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              // eslint-disable-next-line import/no-dynamic-require, global-require
              resources: require(path.join(process.cwd(), '/src/css/globalUtils.js'))
            }
          }
        ]
      },
      {
        test: /\.xml$/,
        use: ['raw-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    react: 'commonjs react',
    'react-dom': 'commonjs react-dom',
    lodash: 'commonjs lodash',
    classnames: 'commonjs classnames'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false,
      terserOptions: {
        keep_classnames: true,
        keep_fnames: true
      }
    })]
  }
}
