// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Expo Router discovers routes in the `app/` directory using Metro's
// require.context feature, which must be enabled.
config.transformer = config.transformer || {};
config.transformer.unstable_allowRequireContext = true;

// Expo SDK 54 enables Metro's package "exports" resolution by default. That
// makes Metro pick the ESM builds of some packages (e.g. Firebase v12), which
// contain `import.meta` and cannot be parsed by Metro/Hermes, producing:
//   "Uncaught SyntaxError: import.meta may only appear in a module".
// Opting out forces Metro to use the CommonJS ("main") builds instead.
// See: https://github.com/expo/expo/discussions/36551
config.resolver = config.resolver || {};
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
