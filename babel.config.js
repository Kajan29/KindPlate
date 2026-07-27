module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
          safe: false,
          allowUndefined: true,
        },
      ],
      [
        "module-resolver",
        {
          alias: {
            "@": "./",
            "@components": "./components",
            "@config": "./config",
            "@hooks": "./hooks",
            "@services": "./services",
            "@store": "./store",
            "@types": "./types",
            "@utils": "./utils",
            "@constants": "./constants",
            "@styles": "./styles",
            "@data": "./data",
            "@assets": "./assets",
          },
        },
      ],
    ],
  };
};
