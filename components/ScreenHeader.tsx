import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing } from "@constants/index";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

/** Sticky glass header with a back button for stack (non-tab) pages. */
export function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  const router = useRouter();
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.bar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        </Pressable>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.right}>{right}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "rgba(255,248,247,0.96)",
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant + "44",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.gutter,
    paddingVertical: 10,
    gap: 8,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceContainerHigh,
  },
  pressed: { opacity: 0.6 },
  titleWrap: { flex: 1 },
  title: { fontSize: 18, fontWeight: "700", color: Colors.primary },
  subtitle: { fontSize: 12, color: Colors.onSurfaceVariant },
  right: { minWidth: 40, alignItems: "flex-end" },
});
