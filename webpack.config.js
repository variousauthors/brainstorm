const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {
  const outputDir = env.development
    ? 'build/dist'
    : 'dist'

  const tsconfig = env.development
    ? 'tsconfig.dev.json'
    : 'tsconfig.production.json'

  return {
    entry: "./src/index.ts",
    watch: true,
    output: {
      path: path.join(__dirname, outputDir),
      filename: "index.js",
      library: 'Brainstorm',
      libraryTarget: 'umd',
      globalObject: 'this',
      publicPath: '/',
    },
    mode: process.env.NODE_ENV || "development",
    resolve: {
      alias: {
        "@Brainstorm": path.resolve(__dirname, 'build/dist/'),
        "@atoms": path.resolve(__dirname, 'src/atoms/'),
        "@common": path.resolve(__dirname, 'src/common/'),
        "@src": path.resolve(__dirname, 'src/'),
      },
      extensions: [".ts", ".tsx", ".js"]
    },
    externals: {
      'react': {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React'
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'ReactDOM'
      } ,
      'react-router': {
        commonjs: 'react-router',
        commonjs2: 'react-router',
        amd: 'react-router',
        root: 'ReactRouter'
      } 
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader", {
            loader: 'ts-loader',
            options: {
              configFile: tsconfig,
            }
          }],
        },
        {
          test: /\.css$/i,
          include: path.resolve(__dirname, 'src'),
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
          use: ["file-loader"],
        },
      ],
    },
  }
};