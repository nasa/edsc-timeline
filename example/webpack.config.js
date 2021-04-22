const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'src/index.html'),
  filename: './index.html',
  favicon: './example/favicon.ico'
})

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    publicPath: '/'
  },
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
  plugins: [
    htmlWebpackPlugin,
    new webpack.DefinePlugin({
      'process.env': {
        PUBLIC_URL: JSON.stringify('/edsc-timeline')
      }
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'source-map',
  devServer: {
    port: 3011,
    historyApiFallback: true,
    contentBase: path.join(__dirname, '/dist')
  }
}
