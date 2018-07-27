const webpack = require('webpack');
const path = require('path');
const vendors = [
  'element-ui',
  'vue'
];

module.exports = {
  output: {
    path: path.join(__dirname, '../other'),
    filename: '[name].[chunkhash].js',
    library: '[name]_[chunkhash]',
  },
  entry: {
    vendor: ['vue', 'vue-router', 'axios'],
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../[name]-manifest.json'),
      name: '[name]_library',
      context: __dirname
    }),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('./vendor-manifest.json')
    // })
  ],
};
