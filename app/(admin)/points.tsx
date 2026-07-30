import { useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard, ScreenBackground, TopBar } from "@components/index";
import { Colors, Radius, Spacing, maxContentWidth } from "@constants/index";
import { useUserStore } from "@store/useUserStore";
import { ROLE_LABELS } from "@store/useUserStore";
import { useAdminStore } from "@store/useAdminStore";

type IoniconName = keyof typeof Ionicons.glyphMap;
type Tab = "members" | "rules";
type RoleFilter = "all" | "donor" | "volunteer";

export default function PointsScreen() {
  const user = useUserStore((s) => s.user);
  const ledger = useAdminStore((s) => s.pointsLedger);
  const pointsRules = useAdminStore((s) => s.pointsRules);
  const adjustPoints = useAdminStore((s) => s.adjustPoints);
  const [tab, setTab] = useState<Tab>("members");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [leaderboard, setLeaderboard] = useState(false);
  const [adjustId, setAdjustId] = useState<string | null>(null);
  const [delta, setDelta] = useState(0);

  const filtered = useMemo(() => {
    let list = ledger.filter((e) => (roleFilter === "all" ? true : e.role === roleFilter));
    if (leaderboard) list = [...list].sort((a, b) => b.points - a.points);
    return list;
  }, [ledger, roleFilter, leaderboard]);

  const adjustTarget = ledger.find((e) => e.id === adjustId);

  const applyAdjust = () => {
    if (adjustId) adjustPoints(adjustId, delta);
    setAdjustId(null);
    setDelta(0);
  };

  return (
    <ScreenBackground>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TopBar avatarUrl={user.avatarUrl} />
      </SafeAreaView>

      <View style={styles.titleWrap}>
        <Text style={styles.title}>Points & Rewards</Text>
        <Text style={styles.subtitle}>Manage balances and reward rules.</Text>
      </View>

      {/* Segmented control */}
      <View style={styles.segment}>
        <Pressable
          onPress={() => setTab("members")}
          style={[styles.segmentBtn, tab === "members" && styles.segmentBtnActive]}
        >
          <Text style={[styles.segmentText, tab === "members" && styles.segmentTextActive]}>
            Members
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("rules")}
          style={[styles.segmentBtn, tab === "rules" && styles.segmentBtnActive]}
        >
          <Text style={[styles.segmentText, tab === "rules" && styles.segmentTextActive]}>
            Rules
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === "members" ? (
          <>
            <View style={styles.controls}>
              <View style={styles.roleChips}>
                {(["all", "donor", "volunteer"] as RoleFilter[]).map((r) => {
                  const active = roleFilter === r;
                  return (
                    <Pressable
                      key={r}
                      onPress={() => setRoleFilter(r)}
                      style={[styles.roleChip, active && styles.roleChipActive]}
                    >
                      <Text style={[styles.roleChipText, active && styles.roleChipTextActive]}>
                        {r === "all" ? "All" : r === "donor" ? "Donors" : "Volunteers"}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Pressable
                onPress={() => setLeaderboard((v) => !v)}
                style={[styles.lbToggle, leaderboard && styles.lbToggleOn]}
              >
                <Ionicons
                  name="trophy"
                  size={15}
                  color={leaderboard ? Colors.onPrimary : Colors.secondary}
                />
                <Text style={[styles.lbToggleText, leaderboard && styles.lbToggleTextOn]}>
                  Rank
                </Text>
              </Pressable>
            </View>

            <GlassCard style={styles.tableCard} padded={false}>
              {filtered.map((e, i) => (
                <View
                  key={e.id}
                  style={[styles.row, i < filtered.length - 1 && styles.rowDivider]}
                >
                  {leaderboard ? (
                    <View style={[styles.rankBadge, rankStyle(i + 1)]}>
                      <Text style={[styles.rankText, i + 1 > 3 && styles.rankTextDark]}>{i + 1}</Text>
                    </View>
                  ) : (
                    <Image source={{ uri: e.avatarUrl }} style={styles.avatar} />
                  )}
                  <View style={styles.flex}>
                    <Text style={styles.name}>{e.name}</Text>
                    <Text style={styles.meta}>
                      {ROLE_LABELS[e.role]} • {e.contributions} contributions
                    </Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={styles.points}>{e.points.toLocaleString()}</Text>
                    <Pressable
                      onPress={() => {
                        setAdjustId(e.id);
                        setDelta(0);
                      }}
                      hitSlop={8}
                      style={styles.adjustBtn}
                    >
                      <Ionicons name="create-outline" size={18} color={Colors.secondary} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </GlassCard>
          </>
        ) : (
          <>
            <Text style={styles.rulesHelper}>
              Points awarded automatically when donations and deliveries are verified.
            </Text>
            <View style={styles.rulesList}>
              {pointsRules.map((r) => (
                <GlassCard key={r.id} style={styles.ruleCard}>
                  <View style={styles.ruleIcon}>
                    <Ionicons name={r.icon as IoniconName} size={20} color={Colors.secondary} />
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.ruleLabel}>{r.label}</Text>
                    <Text style={styles.ruleDetail}>{r.detail}</Text>
                  </View>
                  <View style={styles.rulePoints}>
                    <Text style={styles.rulePointsText}>{r.points}</Text>
                  </View>
                </GlassCard>
              ))}
            </View>
            <Pressable style={styles.addRule}>
              <Ionicons name="add-circle-outline" size={20} color={Colors.secondary} />
              <Text style={styles.addRuleText}>Add a new reward rule</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      {/* Manual adjustment modal */}
      <Modal
        visible={adjustId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setAdjustId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Adjust points</Text>
            {adjustTarget && (
              <Text style={styles.modalDesc}>
                {adjustTarget.name} • current {adjustTarget.points.toLocaleString()} pts
              </Text>
            )}
            <View style={styles.stepperRow}>
              <Pressable onPress={() => setDelta((d) => d - 10)} style={styles.stepBtn}>
                <Ionicons name="remove" size={22} color={Colors.error} />
              </Pressable>
              <View style={styles.deltaWrap}>
                <Text style={[styles.deltaText, delta < 0 && styles.deltaNeg, delta > 0 && styles.deltaPos]}>
                  {delta > 0 ? `+${delta}` : delta}
                </Text>
                <Text style={styles.deltaLabel}>
                  {adjustTarget ? `→ ${Math.max(0, adjustTarget.points + delta).toLocaleString()} pts` : ""}
                </Text>
              </View>
              <Pressable onPress={() => setDelta((d) => d + 10)} style={styles.stepBtn}>
                <Ionicons name="add" size={22} color={Colors.secondary} />
              </Pressable>
            </View>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => {
                  setAdjustId(null);
                  setDelta(0);
                }}
                style={styles.modalCancel}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={applyAdjust} style={styles.modalConfirm}>
                <Text style={styles.modalConfirmText}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
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
  headerSafe: { backgroundColor: "rgba(255,248,247,0.82)" },
  titleWrap: { paddingHorizontal: Spacing.container, paddingTop: Spacing.md },
  title: { fontSize: 24, fontWeight: "700", color: Colors.primary },
  subtitle: { fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 2 },
  segment: {
    flexDirection: "row",
    marginHorizontal: Spacing.container,
    marginTop: 16,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.pill,
    padding: 4,
  },
  segmentBtn: { flex: 1, height: 40, borderRadius: Radius.pill, alignItems: "center", justifyContent: "center" },
  segmentBtnActive: { backgroundColor: Colors.primaryContainer },
  segmentText: { fontSize: 14, fontWeight: "700", color: Colors.secondary },
  segmentTextActive: { color: Colors.onPrimary },
  scroll: {
    width: "100%",
    maxWidth: maxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.container,
    paddingTop: 16,
    paddingBottom: 120,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 10,
  },
  roleChips: { flexDirection: "row", gap: 8, flex: 1 },
  roleChip: {
    paddingHorizontal: 12,
    height: 34,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  roleChipActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  roleChipText: { fontSize: 12, fontWeight: "700", color: Colors.secondary },
  roleChipTextActive: { color: Colors.onSecondary },
  lbToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
  },
  lbToggleOn: { backgroundColor: Colors.primaryContainer, borderColor: Colors.primaryContainer },
  lbToggleText: { fontSize: 12, fontWeight: "700", color: Colors.secondary },
  lbToggleTextOn: { color: Colors.onPrimary },
  tableCard: {},
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant + "33" },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceContainerHigh },
  rankBadge: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  rankText: { fontSize: 16, fontWeight: "700", color: Colors.white },
  rankTextDark: { color: Colors.onSurfaceVariant },
  flex: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700", color: Colors.onSurface },
  meta: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  points: { fontSize: 17, fontWeight: "700", color: Colors.primary },
  adjustBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondaryContainer + "55",
    alignItems: "center",
    justifyContent: "center",
  },
  rulesHelper: { fontSize: 13, color: Colors.onSurfaceVariant, marginBottom: 14 },
  rulesList: { gap: 12 },
  ruleCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  ruleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondaryContainer + "66",
    alignItems: "center",
    justifyContent: "center",
  },
  ruleLabel: { fontSize: 15, fontWeight: "700", color: Colors.onSurface },
  ruleDetail: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  rulePoints: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  rulePointsText: { fontSize: 14, fontWeight: "700", color: Colors.onPrimary },
  addRule: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    height: 50,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: Colors.outlineVariant,
  },
  addRuleText: { fontSize: 14, fontWeight: "700", color: Colors.secondary },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "center",
    paddingHorizontal: Spacing.container,
  },
  modalCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: Radius.xl, padding: 22, gap: 16 },
  modalTitle: { fontSize: 19, fontWeight: "700", color: Colors.primary },
  modalDesc: { fontSize: 13, color: Colors.onSurfaceVariant },
  stepperRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stepBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  deltaWrap: { alignItems: "center", gap: 2 },
  deltaText: { fontSize: 30, fontWeight: "700", color: Colors.onSurface },
  deltaPos: { color: Colors.secondary },
  deltaNeg: { color: Colors.error },
  deltaLabel: { fontSize: 12, color: Colors.onSurfaceVariant },
  modalActions: { flexDirection: "row", gap: 12 },
  modalCancel: {
    flex: 1,
    height: 48,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: { fontSize: 14, fontWeight: "700", color: Colors.onSurfaceVariant },
  modalConfirm: {
    flex: 1,
    height: 48,
    borderRadius: Radius.pill,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  modalConfirmText: { fontSize: 14, fontWeight: "700", color: Colors.white },
});
