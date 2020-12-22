const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/Player/PlayerUi.ts',
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title: '5 Ways to Find the Shortest Path in a Graph',
    //   filename: 'RENAME/index.html',
    //   template: 'templates/indexTemplate.html'
    // }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new CopyPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: 'templates/indexTemplate.html', to: 'index.html' },
        { from: 'codepleds/5-ways-shortest-path/hallo.js', to: 'codepleds/hello.js' },
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
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        loader: 'file-loader',
        options: {
          outputPath: '../dist/fonts',
        }
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/'),
    library: 'Codepled',
  },
};
