import { StyleSheet } from "react-native";
import {
  Colors,
  Radius,
  Shadows,
  Spacing,
  maxContentWidth,
  moderateScale,
} from "@constants/index";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.container,
    paddingTop: Spacing.gutter,
  },
  scrollContent: {
    paddingHorizontal: Spacing.container,
    paddingBottom: moderateScale(120),
  },
  /**
   * Centers content and caps its width on tablets / wide web viewports so the
   * layout never stretches uncomfortably across a large screen.
   */
  centeredContent: {
    width: "100%",
    maxWidth: maxContentWidth,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.card,
    padding: Spacing.gutter,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "55",
    ...Shadows.soft,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outlineVariant + "55",
  },
  emptyText: {
    fontSize: moderateScale(15),
    color: Colors.onSurfaceVariant,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
});
