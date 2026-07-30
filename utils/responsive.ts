import { Dimensions, PixelRatio } from "react-native";

/**
 * Responsive scaling system for KindPlate.
 *
 * Every size in the app used to be a hardcoded pixel value, which is why the
 * layout broke on small phones, large phones, tablets and the web. These
 * helpers scale sizes relative to a reference device (a standard ~5.8" phone)
 * and clamp the scaling factor so the UI stays balanced everywhere:
 *   - small phones get slightly smaller spacing/type (nothing overflows)
 *   - big phones / tablets get slightly larger, more legible controls
 *
 * Scaling is intentionally gentle (clamped) so text stays proportional and the
 * design never looks stretched or cartoonish on big screens.
 */

// Reference device: iPhone X / 13 mini logical resolution.
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const { width, height } = Dimensions.get("window");

/** Shortest edge is the stable dimension regardless of orientation. */
const shortSide = Math.min(width, height);
const longSide = Math.max(width, height);

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

/** Devices with a short edge >= 600dp behave like tablets. */
export const isTablet = shortSide >= 600;
/** Very small / older phones. */
export const isSmallDevice = shortSide < 350;

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

/**
 * Raw width ratio, clamped so tablets/web don't over-scale layout metrics.
 * 0.85 protects small phones, 1.35 gives tablets comfortable breathing room.
 */
const widthRatio = clamp(shortSide / BASE_WIDTH, 0.85, 1.35);
const heightRatio = clamp(longSide / BASE_HEIGHT, 0.85, 1.35);

/** Scale a size proportionally to screen width (good for widths, icons, gaps). */
export function scale(size: number): number {
  return Math.round(size * widthRatio);
}

/** Scale a size proportionally to screen height (good for vertical spacing). */
export function verticalScale(size: number): number {
  return Math.round(size * heightRatio);
}

/**
 * Gentle scale — interpolates between the original size and the fully scaled
 * size by `factor` (default 0.5). Best for padding, margins and radii so they
 * grow just enough on big screens without ballooning.
 */
export function moderateScale(size: number, factor = 0.5): number {
  return Math.round(size + (size * widthRatio - size) * factor);
}

/**
 * Font scaling — capped tighter than layout scaling so type stays readable and
 * proportional across devices. Rounds to the nearest pixel for crisp text.
 */
export function fontScale(size: number): number {
  const ratio = clamp(shortSide / BASE_WIDTH, 0.92, 1.22);
  return Math.round(PixelRatio.roundToNearestPixel(size * ratio));
}

/**
 * On tablets / wide web viewports we cap the readable content column so the
 * layout doesn't stretch edge to edge. Screens center their content within it.
 */
export const maxContentWidth = isTablet ? 620 : Math.min(width, 520);

/** Minimum comfortable touch target (accessibility + low-literacy friendly). */
export const minTouchTarget = moderateScale(52);
