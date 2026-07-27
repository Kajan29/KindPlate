export const Colors = {
  // Primary
  primary: "#FF6B35",
  primaryLight: "#FF8F65",
  primaryDark: "#E55A2B",

  // Secondary
  secondary: "#2EC4B6",
  secondaryLight: "#5DD4C8",
  secondaryDark: "#1FA89B",

  // Neutrals
  white: "#FFFFFF",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  border: "#E8E8E8",
  divider: "#F0F0F0",

  // Text
  textPrimary: "#1A1A2E",
  textSecondary: "#6B7280",
  textLight: "#9CA3AF",
  textInverse: "#FFFFFF",

  // Status
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // Shadows
  shadow: "rgba(0, 0, 0, 0.1)",
} as const;

export type ColorKey = keyof typeof Colors;
