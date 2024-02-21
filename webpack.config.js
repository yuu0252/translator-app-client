module.exports = {
  entry: './src/index.tsx',
  output: {
    path: `${__dirname}/dist`,
    filename: 'main.js',
  },
  devServer: {
    static: {
      directory: './dist',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', 'tsx'],
  },
  mode: 'development',
  module: {
    rules: [
      { test: /\.tsx$/, loader: 'babel-loader', exclude: /node_modules/ },
    ],
  },
};
