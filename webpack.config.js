const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'go-mermaid.js',
    library: 'go-mermaid',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      //{
        //test: /\.ts$/,
        //exclude: /node_modules/,
        //use: 'ts-loader',
      //}

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  //resolve: {
    //extensions: ['.ts']
  //}
};
