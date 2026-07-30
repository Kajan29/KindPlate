// Dynamic Expo config layered on top of the static app.json.
//
// Expo CLI passes the parsed app.json in as `config`, and automatically loads
// environment variables from `.env` before evaluating this file. We use that to
// inject the Google Maps API key into the native Android/iOS configuration so
// that react-native-maps (PROVIDER_GOOGLE) renders real map tiles in the built
// app instead of a blank/grey screen.
//
// The key stays in `.env` (which is gitignored) rather than being committed.
// For EAS cloud builds, expose it with:  eas env:create --name GOOGLE_MAPS_API_KEY

module.exports = ({ config }) => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    console.warn(
      "[app.config] GOOGLE_MAPS_API_KEY is not set. The map will render blank on Android."
    );
  }

  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: {
          ...config.android?.config?.googleMaps,
          apiKey: googleMapsApiKey,
        },
      },
    },
    ios: {
      ...config.ios,
      config: {
        ...config.ios?.config,
        googleMapsApiKey,
      },
    },
  };
};
