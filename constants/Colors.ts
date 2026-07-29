/**
 * KindPlate color system.
 * A Material 3 inspired palette built on the pillars of dignity, warmth and
 * professional reliability. Deep Maroon (primary) + Deep Teal (secondary) +
 * Sage Green (accent) over a soft cream background.
 */
export const Colors = {
  // Primary — Deep Maroon (branding, primary actions, headers)
  primary: "#300112",
  primaryContainer: "#4b1426",
  onPrimary: "#ffffff",
  onPrimaryContainer: "#c6798c",
  primaryFixed: "#ffd9e0",
  primaryFixedDim: "#ffb1c3",
  onPrimaryFixed: "#3a0719",
  onPrimaryFixedVariant: "#713244",
  inversePrimary: "#ffb1c3",

  // Secondary — Deep Teal (navigation, secondary paths)
  secondary: "#3c6661",
  secondaryContainer: "#beebe5",
  onSecondary: "#ffffff",
  onSecondaryContainer: "#426c67",
  secondaryFixed: "#beebe5",
  secondaryFixedDim: "#a3cfc9",
  onSecondaryFixed: "#00201d",
  onSecondaryFixedVariant: "#234e49",

  // Tertiary / Accent — Sage Green (success, surplus, growth)
  tertiary: "#00180b",
  tertiaryContainer: "#002f1a",
  onTertiary: "#ffffff",
  onTertiaryContainer: "#6a997b",
  sage: "#6a997b",
  sageDim: "#a0d2b1",

  // Surfaces — soft cream base
  background: "#fff8f7",
  surface: "#fff8f7",
  surfaceBright: "#fff8f7",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#fef0f2",
  surfaceContainer: "#f8ebec",
  surfaceContainerHigh: "#f2e5e6",
  surfaceContainerHighest: "#eddfe1",
  surfaceDim: "#e4d7d8",
  surfaceVariant: "#eddfe1",
  inverseSurface: "#362e30",
  inverseOnSurface: "#fbedef",

  // Text / content
  onBackground: "#201a1b",
  onSurface: "#201a1b",
  onSurfaceVariant: "#524346",

  // Lines
  outline: "#857376",
  outlineVariant: "#d7c1c5",

  // Status
  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
  success: "#4caf50",
  warning: "#f9d45a",

  // Utility
  white: "#ffffff",
  black: "#000000",
  shadowTeal: "rgba(60, 102, 97, 0.12)",
  shadowMaroon: "rgba(75, 20, 38, 0.10)",
  overlay: "rgba(23, 67, 63, 0.55)",
} as const;

export type ColorKey = keyof typeof Colors;
