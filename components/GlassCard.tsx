import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Colors, Radius, Shadows } from "@constants/index";

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}

/**
 * Frosted "glassmorphism" surface. React Native has no backdrop blur without
 * extra native modules, so we emulate the look with a translucent cream fill,
 * hairline border and soft tinted shadow — faithful to the design intent.
 */
export function GlassCard({ children, style, padded = true }: GlassCardProps) {
  return (
    <View style={[styles.card, padded && styles.padded, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 248, 247, 0.9)",
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "66",
    ...Shadows.soft,
  },
  padded: {
    padding: 16,
  },
});
