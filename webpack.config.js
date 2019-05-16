var package = require('./package.json');

module.exports = {
  entry: {
    'powerbi-report-authoring': './src/powerbi-report-authoring.ts'
  },
  mode: 'production',
  output: {
    path: __dirname + "/dist",
    filename: '[name].js',
    library: package.name,
    libraryTarget: 'umd'
  },
  externals: [
    'powerbi-client',
    'http-post-message',
  ],
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.map$/, loader: 'ignore-loader' },
      { test: /\.d.ts$/, loader: 'ignore-loader' },
      { test: /\.ts$/, exclude: /\.d.ts$/, loader: 'ts-loader' },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
}