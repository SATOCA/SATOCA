const path = require("path");
const nodeExternals = require("webpack-node-externals");
// only works with webpack < 5
// const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = {
   entry: ['./src/App.ts'],
   resolve: {
      extensions: ['.ts', '.js']
   },
   target: "node",
   mode: "production",
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js'
   },
   externals: [
      {
        // skip pg-native in the production deployement and use the pure JS implementation
        'pg-native': 'commonjs2 pg-native'
      }
   ],
   // ignore typeorm database connectors
   ignoreWarnings: [ () => true, ],   
   module: {
      rules: [
         { test: /\.ts$/, loader: 'ts-loader' }
      ]
   },
};