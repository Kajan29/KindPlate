import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius } from "@constants/index";

type Tone = "sage" | "maroon" | "teal" | "warning" | "error" | "neutral";

interface BadgeProps {
  label: string;
  tone?: Tone;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

const TONES: Record<Tone, { bg: string; text: string }> = {
  sage: { bg: "rgba(106, 153, 123, 0.18)", text: Colors.onTertiaryContainer },
  maroon: { bg: Colors.primaryContainer, text: Colors.onPrimary },
  teal: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer },
  warning: { bg: Colors.warning, text: Colors.onSurface },
  error: { bg: Colors.errorContainer, text: Colors.onErrorContainer },
  neutral: { bg: Colors.surfaceContainerHigh, text: Colors.onSurfaceVariant },
};

/** Pill-shaped status / category badge. */
export function Badge({ label, tone = "sage", icon, style }: BadgeProps) {
  const palette = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, style]}>
      {icon && <Ionicons name={icon} size={12} color={palette.text} />}
      <Text style={[styles.text, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
