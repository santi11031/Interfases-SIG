const path = require('path');

module.exports = {
  entry: {
    main1: './source/js/main1.js',
    main2: './source/js/main2.js',
    main3: './source/js/main3.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'source/public/js')
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
      // Add other loaders as needed for different file types
    ]
  }
};
