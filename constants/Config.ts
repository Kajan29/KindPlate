export const Config = {
  APP_NAME: "KindPlate",
  DEFAULT_RADIUS_KM: 5,
  MAX_FOOD_IMAGES: 3,
  FOOD_EXPIRY_HOURS: 24,
  PAGINATION_LIMIT: 20,
  // Firebase collections
  COLLECTIONS: {
    FOOD_ITEMS: "foodItems",
    USERS: "users",
    RESERVATIONS: "reservations",
  },
} as const;

export const Routes = {
  HOME: "/(tabs)",
  EXPLORE: "/(tabs)/explore",
  SHARE: "/(tabs)/share",
  PROFILE: "/(tabs)/profile",
} as const;
