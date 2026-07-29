import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius } from "@constants/index";

type Tone = "maroon" | "teal" | "neutral";

interface ChipProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  tone?: Tone;
  active?: boolean;
  onPress?: () => void;
}

const TONES: Record<Tone, { bg: string; text: string }> = {
  maroon: { bg: Colors.primary, text: Colors.onPrimary },
  teal: { bg: Colors.secondary, text: Colors.onSecondary },
  neutral: { bg: "rgba(255,248,247,0.92)", text: Colors.onSurfaceVariant },
};

/** Rounded filter / category chip used on the map and elsewhere. */
export function Chip({ label, icon, tone = "neutral", active = true, onPress }: ChipProps) {
  const palette = TONES[tone];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: palette.bg },
        !active && styles.inactive,
        pressed && styles.pressed,
      ]}
    >
      {icon && <Ionicons name={icon} size={16} color={palette.text} />}
      <Text style={[styles.text, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: Radius.pill,
  },
  inactive: {
    opacity: 0.85,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  text: {
    fontSize: 13,
    fontWeight: "700",
  },
});
