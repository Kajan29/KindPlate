import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Badge, GlassCard, ScreenHeader } from "@components/index";
import { Colors, Radius, Spacing } from "@constants/index";
import { useAdminStore } from "@store/useAdminStore";
import { ManagedUser, UserRole } from "@/types/food";

type IoniconName = keyof typeof Ionicons.glyphMap;
type Tab = UserRole;

const TABS: { key: Tab; label: string; icon: IoniconName }[] = [
  { key: "donor", label: "Donors", icon: "gift-outline" },
  { key: "volunteer", label: "Volunteers", icon: "bicycle-outline" },
  { key: "recipient", label: "Recipients", icon: "hand-left-outline" },
  { key: "ngo", label: "NGOs", icon: "business-outline" },
];

const STATUS_META: Record<
  ManagedUser["status"],
  { label: string; tone: "sage" | "warning" | "error" }
> = {
  active: { label: "Active", tone: "sage" },
  pending: { label: "Pending", tone: "warning" },
  suspended: { label: "Suspended", tone: "error" },
};

export default function UsersScreen() {
  const [tab, setTab] = useState<Tab>("donor");
  const users = useAdminStore((s) => s.managedUsers);
  const setStatus = useAdminStore((s) => s.setUserStatus);

  const list = useMemo(() => users.filter((u) => u.role === tab), [users, tab]);

  return (
    <View style={styles.root}>
      <ScreenHeader title="User & Role Management" subtitle="Verify, approve and moderate" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
      >
        {TABS.map((t) => {
          const active = tab === t.key;
          const count = users.filter((u) => u.role === t.key).length;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Ionicons name={t.icon} size={15} color={active ? Colors.onPrimary : Colors.secondary} />
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t.label} ({count})
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {list.length === 0 ? (
          <GlassCard style={styles.empty}>
            <Ionicons name="people-outline" size={44} color={Colors.onSurfaceVariant} />
            <Text style={styles.emptyText}>No users in this category.</Text>
          </GlassCard>
        ) : (
          list.map((u) => {
            const status = STATUS_META[u.status];
            return (
              <GlassCard key={u.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Image source={{ uri: u.avatarUrl }} style={styles.avatar} />
                  <View style={styles.flex}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name} numberOfLines={1}>{u.name}</Text>
                      {u.verified && (
                        <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
                      )}
                    </View>
                    <Text style={styles.meta}>{u.meta}</Text>
                  </View>
                  <Badge label={status.label} tone={status.tone} />
                </View>

                <View style={styles.actions}>
                  {u.role === "ngo" && u.status === "pending" && (
                    <Pressable
                      onPress={() => setStatus(u.id, "active", true)}
                      style={[styles.actionBtn, styles.approveBtn]}
                    >
                      <Ionicons name="checkmark" size={16} color={Colors.white} />
                      <Text style={styles.approveText}>Approve Partner</Text>
                    </Pressable>
                  )}

                  {u.status === "pending" && u.role !== "ngo" && (
                    <Pressable
                      onPress={() => setStatus(u.id, "active", true)}
                      style={[styles.actionBtn, styles.approveBtn]}
                    >
                      <Ionicons name="shield-checkmark" size={16} color={Colors.white} />
                      <Text style={styles.approveText}>Verify</Text>
                    </Pressable>
                  )}

                  {u.status !== "suspended" ? (
                    <Pressable
                      onPress={() => setStatus(u.id, "suspended")}
                      style={[styles.actionBtn, styles.suspendBtn]}
                    >
                      <Ionicons name="ban" size={16} color={Colors.error} />
                      <Text style={styles.suspendText}>Suspend</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => setStatus(u.id, "active")}
                      style={[styles.actionBtn, styles.restoreBtn]}
                    >
                      <Ionicons name="refresh" size={16} color={Colors.secondary} />
                      <Text style={styles.restoreText}>Restore</Text>
                    </Pressable>
                  )}
                </View>
              </GlassCard>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  tabRow: { gap: 8, paddingHorizontal: Spacing.container, paddingVertical: 14 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  tabActive: { backgroundColor: Colors.primaryContainer, borderColor: Colors.primaryContainer },
  tabText: { fontSize: 13, fontWeight: "700", color: Colors.secondary },
  tabTextActive: { color: Colors.onPrimary },
  scroll: { paddingHorizontal: Spacing.container, paddingBottom: 40, gap: 14 },
  empty: { alignItems: "center", gap: 12, padding: 32, marginTop: 20 },
  emptyText: { fontSize: 15, color: Colors.onSurfaceVariant },
  card: { gap: 14 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surfaceContainerHigh },
  flex: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 16, fontWeight: "700", color: Colors.onSurface, flexShrink: 1 },
  meta: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  actions: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 44,
    borderRadius: Radius.pill,
  },
  approveBtn: { backgroundColor: Colors.secondary },
  approveText: { fontSize: 13, fontWeight: "700", color: Colors.white },
  suspendBtn: { borderWidth: 2, borderColor: Colors.error },
  suspendText: { fontSize: 13, fontWeight: "700", color: Colors.error },
  restoreBtn: { borderWidth: 2, borderColor: Colors.secondary },
  restoreText: { fontSize: 13, fontWeight: "700", color: Colors.secondary },
});
