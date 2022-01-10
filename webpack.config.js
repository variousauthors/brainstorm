const path = require("path");

console.log('wat')

module.exports = {
  entry: "./src/index.ts",
  watch: true,
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js",
    library: 'Brainstorm',
    libraryTarget: 'umd',
  },
  mode: process.env.NODE_ENV || "development",
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader", {
          loader: 'ts-loader',
          options: {
            configFile: "tsconfig.build.json",
          }
        }],
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: ["file-loader"],
      },
    ],
  },
};