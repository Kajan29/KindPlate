import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Badge, GlassCard, TopBar } from "@components/index";
import { Colors, Config, Radius, Spacing } from "@constants/index";
import { badges } from "@data/index";
import { useUserStore } from "@store/useUserStore";

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function ProfileScreen() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const setLanguage = useUserStore((s) => s.setLanguage);
  const resetActivity = useUserStore((s) => s.resetActivity);

  const unlockedBadges = badges.filter((b) => b.unlocked);

  const cycleLanguage = () => {
    const langs = Config.LANGUAGES;
    const idx = langs.indexOf(user.language);
    setLanguage(langs[(idx + 1) % langs.length]);
  };

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  const switchActivity = () => {
    resetActivity();
    router.push("/(tabs)");
  };

  const actions: {
    icon: IoniconName;
    title: string;
    subtitle: string;
    trailing?: string;
    onPress?: () => void;
  }[] = [
    {
      icon: "swap-horizontal-outline",
      title: "Switch Activity",
      subtitle: "Donate, volunteer or inform a place",
      trailing: user.roleLabel,
      onPress: switchActivity,
    },
    {
      icon: "time-outline",
      title: "My Donation History",
      subtitle: "View your past contributions",
      onPress: () => router.push("/history"),
    },
    {
      icon: "notifications-outline",
      title: "Notifications",
      subtitle: "Alerts, reminders and updates",
      onPress: () => router.push("/notifications"),
    },
    {
      icon: "settings-outline",
      title: "Settings",
      subtitle: "Preferences and account security",
      onPress: () => router.push("/settings"),
    },
    {
      icon: "language-outline",
      title: "Switch Language",
      subtitle: "English, Tamil, or Sinhala",
      trailing: user.language,
      onPress: cycleLanguage,
    },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TopBar avatarUrl={user.avatarUrl} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            {user.verified && (
              <View style={styles.verified}>
                <Ionicons name="checkmark" size={16} color={Colors.onSecondary} />
              </View>
            )}
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <View style={styles.headerChips}>
            <Badge label={user.roleLabel} tone="teal" />
            <View style={styles.pointsChip}>
              <Ionicons name="star" size={14} color={Colors.onPrimary} />
              <Text style={styles.pointsText}>{user.points.toLocaleString()} Points</Text>
            </View>
          </View>
        </View>

        {/* Stats bento */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL MEALS</Text>
            <Text style={styles.statValueTeal}>{user.mealsShared}</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>IMPACT RANK</Text>
            <Text style={styles.statValueMaroon}>{user.rank}</Text>
          </GlassCard>
        </View>

        {/* Badges */}
        <Text style={styles.sectionLabel}>Earned Badges</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgeRow}
        >
          {unlockedBadges.map((b) => (
            <View key={b.id} style={styles.badgeTile}>
              <View style={styles.badgeIcon}>
                <Ionicons name={b.icon as IoniconName} size={24} color={Colors.secondary} />
              </View>
              <Text style={styles.badgeName} numberOfLines={1}>
                {b.name}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Action list */}
        <View style={styles.actions}>
          {actions.map((action) => (
            <Pressable
              key={action.title}
              onPress={action.onPress}
              accessibilityRole="button"
              style={({ pressed }) => [styles.actionRow, pressed && styles.actionPressed]}
            >
              <View style={styles.actionLeft}>
                <View style={styles.actionIcon}>
                  <Ionicons name={action.icon} size={22} color={Colors.secondary} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </View>
              </View>
              <View style={styles.actionTrailing}>
                {action.trailing && <Text style={styles.trailingText}>{action.trailing}</Text>}
                <Ionicons name="chevron-forward" size={20} color={Colors.onSurfaceVariant} />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Sign out */}
        <Pressable
          onPress={handleSignOut}
          accessibilityRole="button"
          style={({ pressed }) => [styles.signOut, pressed && styles.actionPressed]}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
        <Text style={styles.version}>KindPlate Version {Config.APP_VERSION}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerSafe: { backgroundColor: "rgba(255,248,247,0.92)" },
  scroll: {
    paddingHorizontal: Spacing.container,
    paddingTop: Spacing.lg,
    paddingBottom: 120,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarWrap: {
    marginBottom: 14,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.secondaryContainer,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  verified: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: Colors.background,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.onSurface,
    marginBottom: 10,
  },
  headerChips: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pointsChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  pointsText: {
    color: Colors.onPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 18,
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: Colors.onSurfaceVariant,
  },
  statValueTeal: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.secondary,
  },
  statValueMaroon: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: 12,
  },
  badgeRow: {
    gap: 12,
    paddingBottom: 8,
    marginBottom: 20,
  },
  badgeTile: {
    width: 84,
    alignItems: "center",
    gap: 8,
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.secondaryContainer + "66",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeName: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.onSurfaceVariant,
    textAlign: "center",
  },
  actions: {
    gap: 12,
  },
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
  actionPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondaryContainer + "66",
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.onSurface,
  },
  actionSubtitle: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  actionTrailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trailingText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.secondary,
  },
  signOut: {
    marginTop: 32,
    alignSelf: "center",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.error + "33",
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.error,
  },
  version: {
    textAlign: "center",
    fontSize: 13,
    fontStyle: "italic",
    color: Colors.onSurfaceVariant,
    opacity: 0.7,
    marginTop: 16,
  },
});
