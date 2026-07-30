import { StyleSheet } from "react-native";
import { Colors } from "./Colors";
import { fontScale, moderateScale } from "../utils/responsive";

/**
 * Vertical rhythm & spacing — an 8px base scale, now responsive. Values grow a
 * little on big phones / tablets and shrink slightly on small phones so nothing
 * overflows and the layout breathes consistently on every screen size.
 */
export const Spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  gutter: moderateScale(16),
  container: moderateScale(20),
  lg: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(48),
} as const;

/**
 * "Extra rounded" shape language to keep the brand feeling approachable.
 * Radii scale gently (factor 0.35) so corners stay proportional to content.
 */
export const Radius = {
  sm: moderateScale(8, 0.35),
  input: moderateScale(12, 0.35),
  card: moderateScale(16, 0.35),
  button: moderateScale(24, 0.35),
  xl: moderateScale(28, 0.35),
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
 * hierarchy so the layout stays faithful. Font sizes and line heights are now
 * responsive (capped) so text stays legible and proportional on any device.
 */
export const Typography = StyleSheet.create({
  headlineXl: {
    fontSize: fontScale(30),
    lineHeight: fontScale(36),
    fontWeight: "700",
    letterSpacing: -0.4,
    color: Colors.onSurface,
  },
  headlineLg: {
    fontSize: fontScale(26),
    lineHeight: fontScale(34),
    fontWeight: "700",
    color: Colors.onSurface,
  },
  headlineMd: {
    fontSize: fontScale(24),
    lineHeight: fontScale(32),
    fontWeight: "700",
    color: Colors.onSurface,
  },
  headlineSm: {
    fontSize: fontScale(20),
    lineHeight: fontScale(28),
    fontWeight: "600",
    color: Colors.onSurface,
  },
  bodyLg: {
    fontSize: fontScale(18),
    lineHeight: fontScale(28),
    fontWeight: "400",
    color: Colors.onSurface,
  },
  bodyMd: {
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    fontWeight: "400",
    color: Colors.onSurface,
  },
  bodySm: {
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    fontWeight: "400",
    color: Colors.onSurfaceVariant,
  },
  labelMd: {
    fontSize: fontScale(13),
    lineHeight: fontScale(16),
    fontWeight: "600",
    letterSpacing: 0.6,
    color: Colors.onSurfaceVariant,
  },
  caption: {
    fontSize: fontScale(11),
    lineHeight: fontScale(14),
    fontWeight: "400",
    color: Colors.onSurfaceVariant,
  },
});
