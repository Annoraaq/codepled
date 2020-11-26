const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'How to Iterate Through Strings in JavaScript',
      filename: 'RENAME/index.html',
      template: 'templates/indexTemplate.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'RENAME/impressum.html',
      template: 'templates/impressumTemplate.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'RENAME/datenschutz.html',
      template: 'templates/datenschutzTemplate.html'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new CopyPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: 'css', to: 'css' },
        { from: 'webfonts', to: 'webfonts' },
        { from: 'index.html', to: 'index.html' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist/'),
  },
};
