import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, fontScale, moderateScale } from "@constants/index";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  iconRight?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Primary CTA uses the Deep Maroon container with cream text and a fully
 * rounded (24px) shape, per the KindPlate button spec.
 */
export function AppButton({
  label,
  onPress,
  variant = "primary",
  icon,
  iconRight = false,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: AppButtonProps) {
  const palette = VARIANTS[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        variant === "outline" && styles.outline,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <View style={styles.inner}>
          {icon && !iconRight && (
            <Ionicons name={icon} size={moderateScale(20)} color={palette.text} />
          )}
          <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
          {icon && iconRight && (
            <Ionicons name={icon} size={moderateScale(20)} color={palette.text} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const VARIANTS: Record<Variant, { bg: string; text: string; border: string }> = {
  primary: { bg: Colors.primaryContainer, text: Colors.onPrimary, border: Colors.primaryContainer },
  secondary: { bg: Colors.secondary, text: Colors.onSecondary, border: Colors.secondary },
  outline: { bg: "transparent", text: Colors.secondary, border: Colors.secondary },
  ghost: { bg: "transparent", text: Colors.secondary, border: "transparent" },
};

const styles = StyleSheet.create({
  base: {
    minHeight: moderateScale(56),
    borderRadius: Radius.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScale(8),
    borderWidth: 0,
  },
  outline: {
    borderWidth: 2,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(8),
  },
  label: {
    fontSize: fontScale(16),
    fontWeight: "700",
  },
});
