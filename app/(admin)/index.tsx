import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CountdownBadge, GlassCard, TopBar } from "@components/index";
import { Colors, Radius, Spacing } from "@constants/index";
import { useUserStore } from "@store/useUserStore";
import { useAdminStore, isPendingReview } from "@store/useAdminStore";
import { ADMIN_STATUS_META, DONOR_KIND_META, heatZones } from "@data/index";
import { BadgeTone } from "@/types/food";

type IoniconName = keyof typeof Ionicons.glyphMap;

const TONE_COLORS: Record<BadgeTone, { bg: string; fg: string }> = {
  sage: { bg: "rgba(106,153,123,0.18)", fg: Colors.onTertiaryContainer },
  maroon: { bg: Colors.primaryContainer, fg: Colors.onPrimary },
  teal: { bg: Colors.secondaryContainer, fg: Colors.onSecondaryContainer },
  warning: { bg: "rgba(249,212,90,0.28)", fg: "#8a6d00" },
  error: { bg: Colors.errorContainer, fg: Colors.onErrorContainer },
  neutral: { bg: Colors.surfaceContainerHigh, fg: Colors.onSurfaceVariant },
};

export default function AdminDashboard() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const reviewQueue = useAdminStore((s) => s.reviewQueue);
  const deliveries = useAdminStore((s) => s.deliveries);
  const activity = useAdminStore((s) => s.activity);
  const [query, setQuery] = useState("");

  const pending = reviewQueue.filter(isPendingReview);
  const expiring = [...pending].sort((a, b) => a.minutesLeft - b.minutesLeft).slice(0, 3);

  const stats: {
    key: string;
    label: string;
    value: number;
    icon: IoniconName;
    tone: BadgeTone;
    route: string;
  }[] = [
    { key: "pending", label: "Pending Approvals", value: pending.length, icon: "hourglass-outline", tone: "warning", route: "/(admin)/review" },
    { key: "active", label: "Active Deliveries", value: deliveries.filter((d) => d.currentStep < 4).length, icon: "bicycle-outline", tone: "teal", route: "/admin/tracking" },
    { key: "expiring", label: "Expiring Soon", value: pending.filter((d) => d.status === "expiring" || d.minutesLeft <= 60).length, icon: "alarm-outline", tone: "error", route: "/(admin)/review" },
    { key: "zones", label: "High-Demand Zones", value: heatZones.filter((z) => z.level === "high").length, icon: "flame-outline", tone: "maroon", route: "/(admin)/demand" },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TopBar avatarUrl={user.avatarUrl} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Admin Console</Text>
        <Text style={styles.subtitle}>Triage donations, assign riders and keep Jaffna fed.</Text>

        {/* Search / filter */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.onSurfaceVariant} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search donor, area, food type…"
            placeholderTextColor={Colors.onSurfaceVariant}
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => router.push("/(admin)/review")}
          />
          <Pressable onPress={() => router.push("/(admin)/review")} hitSlop={8}>
            <Ionicons name="options-outline" size={20} color={Colors.secondary} />
          </Pressable>
        </View>

        {/* Summary cards */}
        <View style={styles.statGrid}>
          {stats.map((stat) => {
            const tone = TONE_COLORS[stat.tone];
            return (
              <Pressable
                key={stat.key}
                onPress={() => router.push(stat.route as never)}
                style={({ pressed }) => [styles.statCard, pressed && styles.pressed]}
              >
                <View style={[styles.statIcon, { backgroundColor: tone.bg }]}>
                  <Ionicons name={stat.icon} size={20} color={tone.fg} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Expiring soon */}
        <View style={styles.sectionHead}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="alarm" size={18} color={Colors.error} />
            <Text style={styles.sectionTitle}>Expiring Soon</Text>
          </View>
          <Pressable onPress={() => router.push("/(admin)/review")} hitSlop={8}>
            <Text style={styles.link}>Review all</Text>
          </Pressable>
        </View>

        {expiring.length === 0 ? (
          <GlassCard style={styles.clearCard}>
            <Ionicons name="checkmark-done-circle" size={30} color={Colors.secondary} />
            <Text style={styles.clearText}>Nothing urgent — queue is under control.</Text>
          </GlassCard>
        ) : (
          <View style={styles.expiringList}>
            {expiring.map((d) => {
              const kind = DONOR_KIND_META[d.donorKind];
              const status = ADMIN_STATUS_META[d.status];
              return (
                <Pressable
                  key={d.id}
                  onPress={() => router.push(`/admin/donation/${d.id}`)}
                  style={({ pressed }) => [pressed && styles.pressed]}
                >
                  <GlassCard style={styles.expiringCard}>
                    <View style={styles.kindIcon}>
                      <Ionicons name={kind.icon as IoniconName} size={20} color={Colors.secondary} />
                    </View>
                    <View style={styles.flex}>
                      <Text style={styles.expiringTitle} numberOfLines={1}>{d.title}</Text>
                      <Text style={styles.expiringMeta} numberOfLines={1}>
                        {d.donorName} • {d.area}
                      </Text>
                    </View>
                    <View style={styles.expiringRight}>
                      <CountdownBadge minutesLeft={d.minutesLeft} />
                      <Text style={[styles.statusMini, { color: TONE_COLORS[status.tone].fg }]}>
                        {status.label}
                      </Text>
                    </View>
                  </GlassCard>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Activity feed */}
        <View style={styles.sectionHead}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="pulse" size={18} color={Colors.secondary} />
            <Text style={styles.sectionTitle}>Live Activity</Text>
          </View>
        </View>

        <GlassCard style={styles.feedCard} padded={false}>
          {activity.map((a, i) => {
            const tone = TONE_COLORS[a.tone];
            return (
              <View
                key={a.id}
                style={[styles.feedRow, i < activity.length - 1 && styles.feedDivider]}
              >
                <View style={[styles.feedIcon, { backgroundColor: tone.bg }]}>
                  <Ionicons name={a.icon as IoniconName} size={16} color={tone.fg} />
                </View>
                <Text style={styles.feedText}>{a.text}</Text>
                <Text style={styles.feedAgo}>{a.agoLabel}</Text>
              </View>
            );
          })}
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerSafe: { backgroundColor: "rgba(255,248,247,0.92)" },
  scroll: { paddingHorizontal: Spacing.container, paddingTop: Spacing.lg, paddingBottom: 120 },
  title: { fontSize: 26, fontWeight: "700", color: Colors.primary },
  subtitle: { fontSize: 14, color: Colors.onSurfaceVariant, marginTop: 4, marginBottom: 18 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.pill,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "66",
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.onSurface },
  statGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 8 },
  statCard: {
    flexGrow: 1,
    flexBasis: "45%",
    backgroundColor: "rgba(255,248,247,0.95)",
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "55",
    padding: 16,
    gap: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 28, fontWeight: "700", color: Colors.primary },
  statLabel: { fontSize: 13, fontWeight: "600", color: Colors.onSurfaceVariant },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 14,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: Colors.primary },
  link: { fontSize: 13, fontWeight: "700", color: Colors.secondary },
  clearCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 18 },
  clearText: { flex: 1, fontSize: 14, color: Colors.onSurfaceVariant },
  expiringList: { gap: 12 },
  expiringCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  kindIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondaryContainer + "66",
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
  expiringTitle: { fontSize: 15, fontWeight: "700", color: Colors.onSurface },
  expiringMeta: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  expiringRight: { alignItems: "flex-end", gap: 4 },
  statusMini: { fontSize: 11, fontWeight: "700" },
  feedCard: {},
  feedRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  feedDivider: { borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant + "33" },
  feedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  feedText: { flex: 1, fontSize: 13, color: Colors.onSurface, lineHeight: 18 },
  feedAgo: { fontSize: 11, fontWeight: "600", color: Colors.onSurfaceVariant },
});
