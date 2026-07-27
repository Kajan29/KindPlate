export const Config = {
  APP_NAME: "FoodShare",
  API_BASE_URL: "https://api.foodshare.com/v1",
  DEFAULT_RADIUS_KM: 5,
  MAX_FOOD_IMAGES: 3,
  FOOD_EXPIRY_HOURS: 24,
  PAGINATION_LIMIT: 20,
} as const;

export const Routes = {
  HOME: "/(tabs)",
  EXPLORE: "/(tabs)/explore",
  SHARE: "/(tabs)/share",
  PROFILE: "/(tabs)/profile",
} as const;
