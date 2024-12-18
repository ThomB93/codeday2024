/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  return {
    entry: "./src/index.ts",
    output: {
      path: path.resolve(
        __dirname,
        "../../Backend/src/WebApi/wwwroot/ts_frontend",
      ),
      filename: "[name].[chunkhash].js",
      publicPath: "/",
    },
    resolve: {
      extensions: [".js", ".ts"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      new MiniCssExtractPlugin({
        filename: "css/[name].[chunkhash].css",
      }),
    ],
    devtool: isDevelopment ? "eval-source-map" : false,
  };
};
/* eslint-enable @typescript-eslint/no-require-imports, no-undef */
