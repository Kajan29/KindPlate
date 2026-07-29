export const Config = {
  APP_NAME: "KindPlate",
  APP_VERSION: "2.4.0 (Jaffna Release)",
  TAGLINE: "Surplus to Sustenance",
  REGION: "Jaffna & beyond",
  DEFAULT_RADIUS_KM: 5,
  MAX_FOOD_IMAGES: 3,
  MIN_SAFE_HOURS: 2,
  PAGINATION_LIMIT: 20,
  LANGUAGES: ["English", "தமிழ்", "සිංහල"] as const,
} as const;

/**
 * Ready-to-use demo credentials for the frontend-only build. These power the
 * one-tap demo buttons on the login screen so the app can be explored without
 * a backend. The admin account is routed to the admin console automatically.
 */
export const DemoAccounts = {
  user: {
    label: "Demo User",
    email: "user@kindplate.org",
    password: "kindplate",
  },
  admin: {
    label: "Demo Admin",
    email: "admin@kindplate.org",
    password: "kindplate",
  },
} as const;

export type DemoAccountKind = keyof typeof DemoAccounts;

export const Routes = {
  ONBOARDING: "/",
  LOGIN: "/login",
  HOME: "/(tabs)",
  DONATE: "/(tabs)/donate",
  MAP: "/(tabs)/map",
  IMPACT: "/(tabs)/impact",
  PROFILE: "/(tabs)/profile",
} as const;
