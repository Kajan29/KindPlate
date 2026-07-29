import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../GlassCard";
import { TopBar } from "../TopBar";
import { Colors, Radius, Spacing } from "@constants/index";
import { useUserStore } from "@store/useUserStore";
import { approvalQueue, heatZones, ngoSummary, orgLeaderboard } from "@data/index";
import { ApprovalItem } from "@/types/food";

export function NgoDashboard() {
  const user = useUserStore((s) => s.user);
  const [queue, setQueue] = useState<ApprovalItem[]>(approvalQueue);

  const decide = (id: string) => setQueue((q) => q.filter((item) => item.id !== id));

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TopBar avatarUrl={user.avatarUrl} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>NGO Admin Panel</Text>

        {/* Summary bento */}
        <View style={styles.bento}>
          <GlassCard style={styles.impactCard}>
            <Text style={styles.impactKicker}>TOTAL IMPACT</Text>
            <Text style={styles.impactValue}>{ngoSummary.totalImpact.toLocaleString()}</Text>
            <Text style={styles.impactDesc}>Meals rescued & redistributed this month.</Text>
            <View style={styles.trendRow}>
              <Ionicons name="trending-up" size={18} color={Colors.secondary} />
              <Text style={styles.trendText}>{ngoSummary.impactDeltaLabel}</Text>
            </View>
          </GlassCard>
          <View style={styles.smallCol}>
            <View style={[styles.smallCard, styles.tealCard]}>
              <Text style={styles.smallKickerDark}>VOLUNTEERS</Text>
              <Text style={styles.smallValueDark}>{ngoSummary.volunteers}</Text>
            </View>
            <View style={[styles.smallCard, styles.maroonCard]}>
              <Text style={styles.smallKickerLight}>CO₂ SAVED</Text>
              <Text style={styles.smallValueLight}>{ngoSummary.co2Tons} Tons</Text>
            </View>
          </View>
        </View>

        {/* Approval queue */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Donation Approval Queue</Text>
          <View style={styles.pendingPill}>
            <Text style={styles.pendingText}>{queue.length} Pending</Text>
          </View>
        </View>

        {queue.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="checkmark-done-circle" size={52} color={Colors.secondary} />
            <Text style={styles.emptyTitle}>Queue Cleared!</Text>
            <Text style={styles.emptyDesc}>All recent donations have been processed. Great job!</Text>
          </GlassCard>
        ) : (
          <View style={styles.queue}>
            {queue.map((item) => (
              <GlassCard key={item.id} style={styles.approvalCard} padded={false}>
                <View style={styles.approvalImgWrap}>
                  <Image source={{ uri: item.imageUrl }} style={styles.approvalImg} />
                  <View style={styles.catBadge}>
                    <Text style={styles.catBadgeText}>{item.categoryLabel}</Text>
                  </View>
                </View>
                <View style={styles.approvalBody}>
                  <View style={styles.approvalTop}>
                    <Text style={styles.approvalTitle}>{item.title}</Text>
                    <Text style={styles.approvalAgo}>{item.agoLabel}</Text>
                  </View>
                  <Text style={styles.approvalFrom}>From: {item.from}</Text>
                  <Text style={styles.approvalNote}>&ldquo;{item.note}&rdquo;</Text>
                  <View style={styles.approvalActions}>
                    <Pressable
                      onPress={() => decide(item.id)}
                      style={({ pressed }) => [styles.rejectBtn, pressed && styles.pressed]}
                    >
                      <Ionicons name="close" size={18} color={Colors.error} />
                      <Text style={styles.rejectText}>Reject</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => decide(item.id)}
                      style={({ pressed }) => [styles.approveBtn, pressed && styles.pressed]}
                    >
                      <Ionicons name="checkmark" size={18} color={Colors.white} />
                      <Text style={styles.approveText}>Approve</Text>
                    </Pressable>
                  </View>
                </View>
              </GlassCard>
            ))}
          </View>
        )}

        {/* Leaderboard */}
        <Text style={styles.blockTitle}>Top Contributors</Text>
        <GlassCard style={styles.leaderCard} padded={false}>
          {orgLeaderboard.map((org, i) => (
            <View
              key={org.id}
              style={[styles.leaderRow, i < orgLeaderboard.length - 1 && styles.leaderDivider]}
            >
              <View style={[styles.rankBadge, rankStyle(org.rank)]}>
                <Text style={[styles.rankText, org.rank > 3 && styles.rankTextDark]}>
                  {org.rank}
                </Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.orgName}>{org.name}</Text>
                <Text style={styles.orgMeta}>
                  {org.points} pts • {org.tons} Tons
                </Text>
              </View>
              {org.rank === 1 && <Ionicons name="trophy" size={20} color={Colors.secondary} />}
            </View>
          ))}
        </GlassCard>

        {/* Heatmap */}
        <Text style={styles.blockTitle}>Regional Demand Heatmap</Text>
        <View style={styles.heatmap}>
          <View style={[styles.heatBlob, styles.heatHigh, { top: 30, left: 40 }]} />
          <View style={[styles.heatBlob, styles.heatMod, { bottom: 50, right: 50 }]} />
          <View style={styles.road1} />
          <View style={styles.road2} />
          <GlassCard style={styles.legend}>
            <Text style={styles.legendTitle}>Demand Index</Text>
            {heatZones.slice(0, 2).map((z) => (
              <View key={z.id} style={styles.legendRow}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: z.level === "high" ? Colors.error : Colors.primary },
                  ]}
                />
                <Text style={styles.legendText}>
                  {z.area} • {z.families} families
                </Text>
              </View>
            ))}
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}

function rankStyle(rank: number) {
  if (rank === 1) return { backgroundColor: Colors.primary };
  if (rank === 2) return { backgroundColor: Colors.secondary };
  if (rank === 3) return { backgroundColor: Colors.secondaryFixedDim };
  return { backgroundColor: "transparent", borderWidth: 1, borderColor: Colors.outlineVariant };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerSafe: { backgroundColor: "rgba(255,248,247,0.92)" },
  scroll: { paddingHorizontal: Spacing.container, paddingTop: Spacing.lg, paddingBottom: 120 },
  pageTitle: { fontSize: 26, fontWeight: "700", color: Colors.primary, marginBottom: 16 },
  bento: { flexDirection: "row", gap: 12, marginBottom: 28 },
  impactCard: { flex: 1.4, padding: 18, justifyContent: "space-between" },
  impactKicker: { fontSize: 11, fontWeight: "700", letterSpacing: 1, color: Colors.secondary },
  impactValue: { fontSize: 34, fontWeight: "700", color: Colors.primaryContainer, marginVertical: 4 },
  impactDesc: { fontSize: 12, color: Colors.onSurfaceVariant },
  trendRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
  trendText: { fontSize: 12, fontWeight: "700", color: Colors.secondary },
  smallCol: { flex: 1, gap: 12 },
  smallCard: { flex: 1, borderRadius: Radius.card, padding: 16, justifyContent: "center" },
  tealCard: { backgroundColor: Colors.secondaryContainer },
  maroonCard: { backgroundColor: Colors.primaryContainer },
  smallKickerDark: { fontSize: 10, fontWeight: "700", letterSpacing: 1, color: Colors.onSecondaryContainer },
  smallValueDark: { fontSize: 26, fontWeight: "700", color: Colors.onSecondaryContainer, marginTop: 2 },
  smallKickerLight: { fontSize: 10, fontWeight: "700", letterSpacing: 1, color: "rgba(255,255,255,0.8)" },
  smallValueLight: { fontSize: 22, fontWeight: "700", color: Colors.white, marginTop: 2 },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: Colors.primary },
  pendingPill: {
    backgroundColor: Colors.errorContainer,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  pendingText: { fontSize: 12, fontWeight: "700", color: Colors.onErrorContainer },
  queue: { gap: 16, marginBottom: 28 },
  approvalCard: { overflow: "hidden" },
  approvalImgWrap: { height: 150, width: "100%" },
  approvalImg: { width: "100%", height: "100%", backgroundColor: Colors.surfaceContainerHigh },
  catBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catBadgeText: { fontSize: 10, fontWeight: "700", color: Colors.white },
  approvalBody: { padding: 16 },
  approvalTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  approvalTitle: { flex: 1, fontSize: 17, fontWeight: "700", color: Colors.onSurface },
  approvalAgo: { fontSize: 12, fontWeight: "600", color: Colors.onSurfaceVariant, marginLeft: 8 },
  approvalFrom: { fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 4 },
  approvalNote: { fontSize: 13, fontStyle: "italic", color: Colors.onSurfaceVariant, marginTop: 4 },
  approvalActions: { flexDirection: "row", gap: 12, marginTop: 16 },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 46,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  rejectText: { fontSize: 14, fontWeight: "700", color: Colors.error },
  approveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 46,
    borderRadius: Radius.pill,
    backgroundColor: Colors.secondary,
  },
  approveText: { fontSize: 14, fontWeight: "700", color: Colors.white },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  emptyCard: { alignItems: "center", gap: 10, padding: 32, marginBottom: 28 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: Colors.onSurface },
  emptyDesc: { fontSize: 14, color: Colors.onSurfaceVariant, textAlign: "center" },
  blockTitle: { fontSize: 20, fontWeight: "700", color: Colors.primary, marginBottom: 14 },
  leaderCard: { marginBottom: 28 },
  leaderRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  leaderDivider: { borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant + "44" },
  rankBadge: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  rankText: { fontSize: 15, fontWeight: "700", color: Colors.white },
  rankTextDark: { color: Colors.onSurfaceVariant },
  flex: { flex: 1 },
  orgName: { fontSize: 15, fontWeight: "700", color: Colors.onSurface },
  orgMeta: { fontSize: 12, color: Colors.onSurfaceVariant },
  heatmap: {
    height: 260,
    borderRadius: Radius.xl,
    overflow: "hidden",
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 4,
    borderColor: Colors.white,
    justifyContent: "flex-end",
  },
  heatBlob: { position: "absolute", borderRadius: 999 },
  heatHigh: { width: 110, height: 110, backgroundColor: "rgba(186,26,26,0.4)" },
  heatMod: { width: 90, height: 90, backgroundColor: "rgba(48,1,18,0.35)" },
  road1: {
    position: "absolute",
    height: 6,
    width: "160%",
    top: "48%",
    left: "-30%",
    backgroundColor: Colors.secondary + "22",
    transform: [{ rotate: "-10deg" }],
  },
  road2: {
    position: "absolute",
    width: 6,
    height: "160%",
    left: "50%",
    top: "-30%",
    backgroundColor: Colors.secondary + "22",
    transform: [{ rotate: "8deg" }],
  },
  legend: { margin: 14, alignSelf: "flex-start", padding: 14, gap: 8 },
  legendTitle: { fontSize: 12, fontWeight: "700", color: Colors.primary },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 12, color: Colors.onSurface },
});
