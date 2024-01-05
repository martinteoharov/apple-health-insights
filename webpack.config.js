const webpack = require('webpack');

module.exports = {
  // ... your existing configuration ...

  resolve: {
    // ... other resolve options ...
    fallback: {
      "stream": require.resolve('stream-browserify'),
      "timers": require.resolve('timers-browserify'),
      "buffer": require.resolve('buffer/'), // Include this if you haven't already
      // ... add other polyfills as needed ...
    },
  },
  plugins: [
    // ... other plugins ...
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser', // Include this if you are using 'process' in your code
    }),
  ],
};
