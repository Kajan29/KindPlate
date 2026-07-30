import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, fontScale, moderateScale } from "@constants/index";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(14),
  },
  title: {
    fontSize: fontScale(20),
    fontWeight: "700",
    color: Colors.secondary,
  },
  action: {
    fontSize: fontScale(13),
    fontWeight: "700",
    color: Colors.secondary,
    letterSpacing: 0.3,
  },
});
