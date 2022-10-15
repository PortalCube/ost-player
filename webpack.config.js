const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const CopyWebpackPlugin = require('copy-webpack-plugin');

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
                    // Creates `style` nodes from JS strings
                    isProd ? MiniCssExtractPlugin.loader : "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
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
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            `...`,
            new CssMinimizerPlugin()
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "public/index.html"
        }),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         { from: 'static' }
        //     ]
        // }),
        new MiniCssExtractPlugin({ filename: "main.css" })
    ],
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        publicPath:
            process.env.MODE === "production"
                ? "https://storage.prisism.io/emoi/"
                : "auto"
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
