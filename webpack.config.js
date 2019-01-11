const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
  mode: "production",
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  entry: {
    background_scripts: "./background_scripts/script.js",
    content_scripts: "./content_scripts/script.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]/script.js"
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "icons",
        to: "icons"
      }, {
        from: "manifest.json"
      }])
  ]
};
