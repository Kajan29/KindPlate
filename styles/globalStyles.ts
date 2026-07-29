import { StyleSheet } from "react-native";
import { Colors, Radius, Shadows, Spacing } from "@constants/index";

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
    paddingBottom: 120,
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
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
});
