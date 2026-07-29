// Dynamic Expo config.
// Expo reads the static `app.json` first and passes it in as `config`.
// We inject the Google Maps API key (from the environment / .env) into the
// native config so react-native-maps can render Google Maps on Android & iOS.
// Keeping the key in env means it never gets committed in app.json.

module.exports = ({ config }) => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...(config.android && config.android.config),
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },
    ios: {
      ...config.ios,
      config: {
        ...(config.ios && config.ios.config),
        googleMapsApiKey,
      },
    },
  };
};
