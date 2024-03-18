// webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {
    const mode = env && env.production ? 'production' : 'development';
  
    return {
      mode: mode,
      entry: './bin/www', // Entry point of your server-side code
      output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: 'server.bundle.js' // Output bundle file name
      },
      plugins: [
        // Or, for WebPack 4+:
        new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })
      ],    
      target: 'node', // Specify the target environment, 'node' for server-side
      node: {
        __dirname: false, // Keep __dirname as-is
        __filename: false // Keep __filename as-is
      },
      // Add any additional loaders, plugins, etc. as needed
    };
  };
  