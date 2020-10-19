var webpack = require('webpack'),
    fs = require('fs'),
    pkg = JSON.parse(fs.readFileSync('./package.json')),
    license;

license = fs.readFileSync('./LICENSE')
  .toString()
  .split(/\s+---\s+/, 1)[0];

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: './src/js/edsc-timeline.coffee',
  output: {
    path: __dirname + '/dist',
    filename: 'edsc-timeline.min.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.coffee$/,
        use: 'coffee-loader'
      },
      {
        test: /\.(gif|png)$/,
        use: 'url-loader?limit=100000'
      },
      {
        test: /\.hbs$/,
        use: 'handlebars-loader'
       }
    ]
  },
  devtool: 'source-map',
  externals: {
    'jquery': 'jQuery',
    'window': 'window'
  },
  resolve: {
    extensions: ['.js', '.json', '.coffee']
  },
  plugins: [
    // https://github.com/webpack/webpack/issues/6556
    new webpack.LoaderOptionsPlugin({ options: {} }),
    new webpack.BannerPlugin(license),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'root.jQuery': 'jquery'
    })
  ]
};
