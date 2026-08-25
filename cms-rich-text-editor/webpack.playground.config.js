const path = require("path");

module.exports = {
  context: __dirname,
  entry: {
    editor: "./src/playground/editor.js",
  },
  output: {
    path: path.resolve(__dirname, "dist/playground"),
    filename: "[name].js",
    publicPath: "/",
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime')
    },
  },
  devServer: {
    port: 8081,
    open: true,
    hot: true,
    historyApiFallback: false,
    allowedHosts: 'all',
    static: {
      directory: path.join(__dirname, "playground"),
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    client: {
      webSocketURL: {
        hostname: 'localhost'
      },
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|j?g|svg|gif)?$/,
        use: "file-loader",
      },
    ],
  },
};
