import { useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CountdownBadge, GlassCard, ScreenBackground, TopBar } from "@components/index";
import { Colors, Radius, Spacing, maxContentWidth } from "@constants/index";
import { useUserStore } from "@store/useUserStore";
import { CATEGORY_META, DONOR_KIND_META } from "@data/index";
import { useAdminStore, isPendingReview } from "@store/useAdminStore";

type IoniconName = keyof typeof Ionicons.glyphMap;

type FilterKey = "all" | "pending" | "expiring" | "veg" | "non_veg";

const FILTERS: { key: FilterKey; label: string; icon: IoniconName }[] = [
  { key: "all", label: "All", icon: "layers-outline" },
  { key: "pending", label: "Pending", icon: "hourglass-outline" },
  { key: "expiring", label: "Expiring", icon: "alarm-outline" },
  { key: "veg", label: "Veg", icon: "leaf-outline" },
  { key: "non_veg", label: "Non-Veg", icon: "fish-outline" },
];

export default function ReviewQueueScreen() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  const reviewQueue = useAdminStore((s) => s.reviewQueue);
  const approveDonation = useAdminStore((s) => s.approveDonation);
  const rejectDonation = useAdminStore((s) => s.rejectDonation);

  const [filter, setFilter] = useState<FilterKey>("all");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const visible = useMemo(
    () =>
      reviewQueue.filter(isPendingReview).filter((d) => {
        switch (filter) {
          case "pending":
            return d.status === "pending";
          case "expiring":
            return d.status === "expiring" || d.minutesLeft <= 60;
          case "veg":
            return d.category === "veg" || d.category === "produce";
          case "non_veg":
            return d.category === "non_veg";
          default:
            return true;
        }
      }),
    [reviewQueue, filter]
  );

  const approve = (id: string) => approveDonation(id);

  const confirmReject = () => {
    if (rejectId) rejectDonation(rejectId, reason);
    setRejectId(null);
    setReason("");
  };

  const pendingCount = reviewQueue.filter(isPendingReview).length;

  return (
    <ScreenBackground>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TopBar avatarUrl={user.avatarUrl} />
      </SafeAreaView>

      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Review Queue</Text>
          <Text style={styles.subtitle}>{pendingCount} awaiting your decision</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countText}>{pendingCount}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Ionicons
                name={f.icon}
                size={15}
                color={active ? Colors.onPrimary : Colors.secondary}
              />
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {visible.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="checkmark-done-circle" size={52} color={Colors.secondary} />
            <Text style={styles.emptyTitle}>Queue cleared!</Text>
            <Text style={styles.emptyDesc}>No donations match this filter right now.</Text>
          </GlassCard>
        ) : (
          visible.map((d) => {
            const kind = DONOR_KIND_META[d.donorKind];
            const cat = CATEGORY_META[d.category];
            const isVeg = d.category === "veg" || d.category === "produce";
            return (
              <GlassCard key={d.id} style={styles.card} padded={false}>
                <Pressable onPress={() => router.push(`/admin/donation/${d.id}`)}>
                  <View style={styles.imgWrap}>
                    <Image source={{ uri: d.imageUrl }} style={styles.img} />
                    <View style={styles.imgTopRow}>
                      <View style={[styles.catTag, { backgroundColor: isVeg ? "#2e7d32" : Colors.primary }]}>
                        <Ionicons name={cat.icon as IoniconName} size={12} color={Colors.white} />
                        <Text style={styles.catTagText}>{cat.label}</Text>
                      </View>
                      <CountdownBadge minutesLeft={d.minutesLeft} />
                    </View>
                  </View>

                  <View style={styles.body}>
                    <View style={styles.donorRow}>
                      <View style={styles.kindIcon}>
                        <Ionicons name={kind.icon as IoniconName} size={16} color={Colors.secondary} />
                      </View>
                      <Text style={styles.donorName} numberOfLines={1}>{d.donorName}</Text>
                      <Text style={styles.donorKind}>{kind.label}</Text>
                    </View>

                    <Text style={styles.cardTitle}>{d.title}</Text>

                    <View style={styles.metaRow}>
                      <View style={styles.metaChip}>
                        <Ionicons
                          name={d.prePackaged ? "cube" : "cube-outline"}
                          size={13}
                          color={Colors.onSurfaceVariant}
                        />
                        <Text style={styles.metaChipText}>
                          {d.prePackaged ? "Pre-parcelled" : "Needs container"}
                        </Text>
                      </View>
                      <View style={styles.metaChip}>
                        <Ionicons name="sparkles-outline" size={13} color={Colors.onSurfaceVariant} />
                        <Text style={styles.metaChipText}>{d.occasion}</Text>
                      </View>
                    </View>

                    <View style={styles.metaRow}>
                      <View style={styles.metaChip}>
                        <Ionicons name="flame-outline" size={13} color={Colors.onSurfaceVariant} />
                        <Text style={styles.metaChipText}>{d.cookedAtLabel}</Text>
                      </View>
                      <View style={styles.metaChip}>
                        <Ionicons name="location-outline" size={13} color={Colors.secondary} />
                        <Text style={styles.metaChipText}>{d.area} • {d.distanceKm} km</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>

                <View style={styles.actions}>
                  <Pressable
                    onPress={() => setRejectId(d.id)}
                    style={({ pressed }) => [styles.rejectBtn, pressed && styles.pressed]}
                  >
                    <Ionicons name="close" size={18} color={Colors.error} />
                    <Text style={styles.rejectText}>Reject</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => approve(d.id)}
                    style={({ pressed }) => [styles.approveBtn, pressed && styles.pressed]}
                  >
                    <Ionicons name="checkmark" size={18} color={Colors.white} />
                    <Text style={styles.approveText}>Approve</Text>
                  </Pressable>
                </View>
              </GlassCard>
            );
          })
        )}
      </ScrollView>

      {/* Reject reason modal */}
      <Modal
        visible={rejectId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reject donation</Text>
            <Text style={styles.modalDesc}>Add an optional reason for the donor.</Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="e.g., Past safe freshness window"
              placeholderTextColor={Colors.onSurfaceVariant}
              style={styles.modalInput}
              multiline
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => {
                  setRejectId(null);
                  setReason("");
                }}
                style={({ pressed }) => [styles.modalCancel, pressed && styles.pressed]}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={confirmReject}
                style={({ pressed }) => [styles.modalConfirm, pressed && styles.pressed]}
              >
                <Text style={styles.modalConfirmText}>Confirm Reject</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerSafe: { backgroundColor: "rgba(255,248,247,0.82)" },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: maxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.container,
    paddingTop: Spacing.md,
  },
  title: { fontSize: 24, fontWeight: "700", color: Colors.primary },
  subtitle: { fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 2 },
  countPill: {
    minWidth: 40,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: { color: Colors.onPrimary, fontSize: 16, fontWeight: "700" },
  filterRow: { gap: 8, paddingHorizontal: Spacing.container, paddingVertical: 14 },
  filterChip: {
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
  filterChipActive: { backgroundColor: Colors.primaryContainer, borderColor: Colors.primaryContainer },
  filterText: { fontSize: 13, fontWeight: "700", color: Colors.secondary },
  filterTextActive: { color: Colors.onPrimary },
  scroll: {
    width: "100%",
    maxWidth: maxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.container,
    paddingBottom: 120,
    gap: 16,
  },
  card: { overflow: "hidden" },
  imgWrap: { height: 150, width: "100%" },
  img: { width: "100%", height: "100%", backgroundColor: Colors.surfaceContainerHigh },
  imgTopRow: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  catTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  catTagText: { fontSize: 11, fontWeight: "700", color: Colors.white },
  body: { padding: 16, gap: 8 },
  donorRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  kindIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.secondaryContainer + "66",
    alignItems: "center",
    justifyContent: "center",
  },
  donorName: { flex: 1, fontSize: 13, fontWeight: "700", color: Colors.onSurface },
  donorKind: { fontSize: 11, fontWeight: "700", color: Colors.secondary },
  cardTitle: { fontSize: 17, fontWeight: "700", color: Colors.primary },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  metaChipText: { fontSize: 12, color: Colors.onSurfaceVariant, fontWeight: "600" },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
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
  emptyCard: { alignItems: "center", gap: 10, padding: 32, marginTop: 20 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: Colors.onSurface },
  emptyDesc: { fontSize: 14, color: Colors.onSurfaceVariant, textAlign: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "center",
    paddingHorizontal: Spacing.container,
  },
  modalCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.xl,
    padding: 22,
    gap: 12,
  },
  modalTitle: { fontSize: 19, fontWeight: "700", color: Colors.primary },
  modalDesc: { fontSize: 13, color: Colors.onSurfaceVariant },
  modalInput: {
    minHeight: 72,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    borderRadius: Radius.input,
    padding: 12,
    fontSize: 14,
    color: Colors.onSurface,
    textAlignVertical: "top",
  },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 4 },
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
    backgroundColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  modalConfirmText: { fontSize: 14, fontWeight: "700", color: Colors.white },
});
