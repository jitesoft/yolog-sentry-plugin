const Path = require('path');

const base = {
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
  }
};

const node = Object.assign({}, {
  target: 'node',
  output: {
    filename: 'index.js',
    globalObject: 'this',
    libraryTarget: 'umd'
  }
}, base);

const web = Object.assign({}, {
  target: 'web',
  output: {
    filename: 'index-browser.js',
    globalObject: 'this',
    libraryTarget: 'umd'
  }
}, base);

module.exports = [
  node, web
];
