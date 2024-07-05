const path = require('path');

module.exports = {
  entry: {'fleekAutomaterProxy': './src/fleekAutomaterProxy.js'},
  mode: "none",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js' ,
    iife: false, 
  },
};
