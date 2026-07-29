// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Expo Router discovers routes in the `app/` directory using Metro's
// require.context feature, which must be enabled.
config.transformer = config.transformer || {};
config.transformer.unstable_allowRequireContext = true;

module.exports = config;
