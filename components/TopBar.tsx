import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, fontScale, moderateScale } from "@constants/index";

interface TopBarProps {
  avatarUrl?: string;
  onNotifications?: () => void;
  showNotificationDot?: boolean;
}

/** Sticky glass app bar with the KindPlate wordmark. */
export function TopBar({ avatarUrl, onNotifications, showNotificationDot = true }: TopBarProps) {
  const router = useRouter();
  const handleNotifications =
    onNotifications ?? (() => router.push("/notifications"));
  return (
    <View style={styles.bar}>
      <View style={styles.left}>
        <View style={styles.logoDot}>
          <Text style={styles.logoEmoji}>🥘</Text>
        </View>
        <Text style={styles.title}>KindPlate</Text>
      </View>
      <View style={styles.right}>
        <Pressable
          onPress={handleNotifications}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        >
          <Ionicons name="notifications-outline" size={moderateScale(24)} color={Colors.secondary} />
          {showNotificationDot && <View style={styles.dot} />}
        </Pressable>
        {avatarUrl && (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.container,
    paddingVertical: 10,
    backgroundColor: "rgba(255,248,247,0.92)",
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant + "44",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoDot: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    backgroundColor: Colors.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "66",
  },
  logoEmoji: {
    fontSize: fontScale(19),
  },
  title: {
    fontSize: fontScale(22),
    fontWeight: "700",
    color: Colors.primary,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    padding: moderateScale(8),
    borderRadius: 999,
  },
  pressed: {
    opacity: 0.6,
  },
  dot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  avatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    borderWidth: 2,
    borderColor: Colors.secondary,
    marginLeft: 4,
  },
});
