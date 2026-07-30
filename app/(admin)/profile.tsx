import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Badge, GlassCard, ScreenBackground, TopBar } from "@components/index";
import { Colors, Config, Radius, Spacing, maxContentWidth } from "@constants/index";
import { useUserStore } from "@store/useUserStore";
import { useAdminStore, isPendingReview } from "@store/useAdminStore";

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function AdminProfileScreen() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const managedUsers = useAdminStore((s) => s.managedUsers);
  const disputes = useAdminStore((s) => s.disputes);
  const reviewQueue = useAdminStore((s) => s.reviewQueue);

  const pendingUsers = managedUsers.filter((u) => u.status === "pending").length;
  const openDisputes = disputes.filter((d) => d.status === "open").length;
  const pendingReviews = reviewQueue.filter(isPendingReview).length;

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  const management: {
    icon: IoniconName;
    title: string;
    subtitle: string;
    badge?: number;
    onPress: () => void;
  }[] = [
    {
      icon: "people-outline",
      title: "User & Role Management",
      subtitle: "Donors, volunteers, recipients & NGOs",
      badge: pendingUsers,
      onPress: () => router.push("/admin/users"),
    },
    {
      icon: "git-branch-outline",
      title: "Delivery Tracking",
      subtitle: "Lifecycle & proof-of-delivery",
      onPress: () => router.push("/admin/tracking"),
    },
    {
      icon: "alert-circle-outline",
      title: "Dispute Resolution",
      subtitle: "Flagged deliveries & complaints",
      badge: openDisputes,
      onPress: () => router.push("/admin/disputes"),
    },
    {
      icon: "clipboard-outline",
      title: "Review Queue",
      subtitle: `${pendingReviews} donations awaiting action`,
      onPress: () => router.push("/(admin)/review"),
    },
    {
      icon: "settings-outline",
      title: "Settings",
      subtitle: "Preferences and account security",
      onPress: () => router.push("/settings"),
    },
  ];

  return (
    <ScreenBackground>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TopBar avatarUrl={user.avatarUrl} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            <View style={styles.shield}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.onSecondary} />
            </View>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Badge label={user.roleLabel} tone="maroon" icon="shield-checkmark" />
        </View>

        {/* Ops snapshot */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>PENDING USERS</Text>
            <Text style={styles.statValueMaroon}>{pendingUsers}</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>OPEN DISPUTES</Text>
            <Text style={styles.statValueTeal}>{openDisputes}</Text>
          </GlassCard>
        </View>

        <Text style={styles.sectionLabel}>Management</Text>
        <View style={styles.actions}>
          {management.map((a) => (
            <Pressable
              key={a.title}
              onPress={a.onPress}
              style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
            >
              <View style={styles.actionLeft}>
                <View style={styles.actionIcon}>
                  <Ionicons name={a.icon} size={22} color={Colors.secondary} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.actionTitle}>{a.title}</Text>
                  <Text style={styles.actionSubtitle}>{a.subtitle}</Text>
                </View>
              </View>
              <View style={styles.actionTrailing}>
                {a.badge ? (
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{a.badge}</Text>
                  </View>
                ) : null}
                <Ionicons name="chevron-forward" size={20} color={Colors.onSurfaceVariant} />
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
        <Text style={styles.version}>KindPlate Admin • Version {Config.APP_VERSION}</Text>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerSafe: { backgroundColor: "rgba(255,248,247,0.82)" },
  scroll: {
    width: "100%",
    maxWidth: maxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.container,
    paddingTop: Spacing.lg,
    paddingBottom: 120,
  },
  header: { alignItems: "center", marginBottom: 24, gap: 10 },
  avatarWrap: { marginBottom: 4 },
  avatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 4,
    borderColor: Colors.primaryContainer,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  shield: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: Colors.background,
  },
  name: { fontSize: 24, fontWeight: "700", color: Colors.onSurface },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: { flex: 1, padding: 18, gap: 4 },
  statLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.6, color: Colors.onSurfaceVariant },
  statValueMaroon: { fontSize: 24, fontWeight: "700", color: Colors.primary },
  statValueTeal: { fontSize: 24, fontWeight: "700", color: Colors.secondary },
  sectionLabel: { fontSize: 18, fontWeight: "700", color: Colors.secondary, marginBottom: 12 },
  actions: { gap: 12 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,248,247,0.95)",
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "44",
    padding: 14,
  },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  actionLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondaryContainer + "66",
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: "700", color: Colors.onSurface },
  actionSubtitle: { fontSize: 13, color: Colors.onSurfaceVariant },
  actionTrailing: { flexDirection: "row", alignItems: "center", gap: 8 },
  countBadge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: 12,
    backgroundColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: { fontSize: 12, fontWeight: "700", color: Colors.white },
  signOut: {
    marginTop: 32,
    alignSelf: "center",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.error + "33",
  },
  signOutText: { fontSize: 16, fontWeight: "700", color: Colors.error },
  version: {
    textAlign: "center",
    fontSize: 13,
    fontStyle: "italic",
    color: Colors.onSurfaceVariant,
    opacity: 0.7,
    marginTop: 16,
  },
});
