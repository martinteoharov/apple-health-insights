const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add a fallback for the 'stream' and 'buffer' modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    timers: require.resolve('timers-browserify'),
  };

  // Provide plugin configuration
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
};
