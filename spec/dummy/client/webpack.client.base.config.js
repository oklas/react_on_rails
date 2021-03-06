// Common client-side webpack configuration used by
// webpack.client.rails.hot.config and webpack.client.rails.build.config.

const webpack = require('webpack');
const { resolve, join } = require('path');
const webpackCommon = require('./webpack.common');
const { assetLoaderRules } = webpackCommon;

const ManifestPlugin = require('webpack-manifest-plugin');
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');
const configPath = resolve('..', 'config', 'webpack');
const { paths, publicPath } = webpackConfigLoader(configPath);

const devBuild = process.env.NODE_ENV !== 'production';

module.exports = {

  // the project dir
  context: resolve(__dirname),
  entry: {
    // This will contain the app entry points defined by
    // webpack.client.rails.hot.config and webpack.client.rails.build.config
    'app-bundle': [
      './app/startup/clientRegistration',
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      images: join(process.cwd(), 'app', 'assets', 'images'),
    },
  },


  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
    new webpack.DefinePlugin({
      TRACE_TURBOLINKS: devBuild,
    }),

    // https://webpack.js.org/guides/code-splitting-libraries/#implicit-common-vendor-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor-bundle',
      minChunks(module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),
    new ManifestPlugin({ fileName: paths.manifest, publicPath, writeToFileEmit: true }),
  ],

  module: {
    rules: [
      ...assetLoaderRules,

      {
        test: require.resolve('jquery'),
        use: {
          loader: 'expose-loader',
          options: {
            jQuery: true,
          },
        },
      },
    ],
  },
};
