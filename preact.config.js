require('dotenv').config();

const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const resolveEnvVars = require('resolve-env-vars');

const tailwindcss = require('tailwindcss');

module.exports = (config, env, helpers) => {
  const { stringified, raw } = resolveEnvVars('DEMO_');

  config.plugins.push(new DefinePlugin(stringified));
  config.plugins.push(new CopyPlugin([{ from: '../public/', to: '' }]));

  const { plugin: htmlPlugin } = helpers.getPluginsByName(config, 'HtmlWebpackPlugin')[0] || {};

  if (htmlPlugin) {
    // Pass all prefixed env vars to the HTML template.
    htmlPlugin.options.env = raw;
  }
  const results = helpers.getLoadersByName(config, 'postcss-loader');
  for (const result of results) {
    result.loader.options.plugins = [
      tailwindcss('./tailwind.config.js'),
      // add other postcss plugins below
      require('postcss-100vh-fix'),
      require('autoprefixer'),
      ...result.loader.options.plugins,
    ];
  }

  return config;
};
