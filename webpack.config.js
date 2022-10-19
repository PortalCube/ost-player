const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isDev = process.env.MODE === "development";
const isProd = process.env.MODE === "production";

module.exports = {
    mode: process.env.MODE || "development",
    entry: "./src/main.ts",
    module: {
        rules: [
            {
                test: /\.scss$/i,
                exclude: /node_modules/,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },

    optimization: {
        minimizer: [`...`, new CssMinimizerPlugin()]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "public/index.html"
        }),
        new MiniCssExtractPlugin({ filename: "main.css" })
    ],
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "auto"
    },
    devServer: {
        client: {
            logging: "warn"
        },
        static: true,
        compress: true,
        liveReload: true,
        watchFiles: ["src/*", "public/*"]
    }
};
