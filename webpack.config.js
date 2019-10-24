const Path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: [
    Path.join(__dirname, 'src', 'index.js')
  ],
  externals: {
    '@jitesoft/yolog': '@jitesoft/yolog'
  },
  module: {
    rules: [
      {
        include: Path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
    library: '@jitesoft/yolog-sentry-plugin',
    globalObject: 'this'
  }
};
