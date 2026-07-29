import { StyleSheet } from "react-native";
import { Colors } from "./Colors";

/**
 * Vertical rhythm & spacing — everything in multiples of 8px.
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  gutter: 16,
  container: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * "Extra rounded" shape language to keep the brand feeling approachable.
 */
export const Radius = {
  sm: 8,
  input: 12,
  card: 16,
  button: 24,
  xl: 28,
  pill: 9999,
} as const;

/**
 * Soft, tinted shadows — we avoid heavy dark shadows on the cream surface.
 */
export const Shadows = {
  soft: {
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  card: {
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  floating: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
} as const;

/**
 * Type scale. Poppins is used for headlines and Inter for body in the design
 * system; we map to platform system fonts and preserve the size / weight
 * hierarchy so the layout stays faithful.
 */
export const Typography = StyleSheet.create({
  headlineXl: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: Colors.onSurface,
  },
  headlineLg: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "700",
    color: Colors.onSurface,
  },
  headlineMd: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    color: Colors.onSurface,
  },
  headlineSm: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    color: Colors.onSurface,
  },
  bodyLg: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "400",
    color: Colors.onSurface,
  },
  bodyMd: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    color: Colors.onSurface,
  },
  bodySm: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    color: Colors.onSurfaceVariant,
  },
  labelMd: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "600",
    letterSpacing: 0.6,
    color: Colors.onSurfaceVariant,
  },
  caption: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "400",
    color: Colors.onSurfaceVariant,
  },
});
