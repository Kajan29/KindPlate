import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppButton, Badge, CountdownBadge, GlassCard, ScreenBackground, ScreenHeader } from "@components/index";
import { Colors, Radius, Spacing } from "@constants/index";
import { ADMIN_STATUS_META, CATEGORY_META, DONOR_KIND_META } from "@data/index";
import { useAdminStore } from "@store/useAdminStore";

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function DonationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const reviewQueue = useAdminStore((s) => s.reviewQueue);
  const allVolunteers = useAdminStore((s) => s.volunteers);
  const ngoPartners = useAdminStore((s) => s.ngoPartners);
  const approveDonation = useAdminStore((s) => s.approveDonation);
  const rejectDonation = useAdminStore((s) => s.rejectDonation);
  const assignDonation = useAdminStore((s) => s.assignDonation);

  const donation = useMemo(() => reviewQueue.find((d) => d.id === id), [reviewQueue, id]);

  const [selfDelivery, setSelfDelivery] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<string | null>(null);
  const [ngoOpen, setNgoOpen] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState<string | null>(null);

  const volunteers = useMemo(
    () =>
      [...allVolunteers].sort((a, b) => {
        if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;
        return Number(b.hasVehicle) - Number(a.hasVehicle);
      }),
    [allVolunteers]
  );

  if (!donation) {
    return (
      <ScreenBackground>
        <ScreenHeader title="Donation" />
        <View style={styles.missing}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.onSurfaceVariant} />
          <Text style={styles.missingText}>This donation is no longer available.</Text>
          <AppButton label="Back to queue" variant="outline" fullWidth={false} onPress={() => router.back()} />
        </View>
      </ScreenBackground>
    );
  }

  const kind = DONOR_KIND_META[donation.donorKind];
  const cat = CATEGORY_META[donation.category];
  const approved = donation.status === "approved" || donation.status === "assigned";
  const rejected = donation.status === "rejected";
  const assigned = donation.status === "assigned";
  const statusMeta = ADMIN_STATUS_META[donation.status];

  const canAssign = approved && !assigned;
  const assignReady = selfDelivery || !!selectedVolunteer || !!selectedNgo;

  const handleApprove = () => approveDonation(donation.id);
  const handleReject = () => rejectDonation(donation.id);

  const handleAssign = () => {
    if (!assignReady) return;
    if (selfDelivery) {
      assignDonation(donation.id, { type: "self" });
    } else if (selectedNgo) {
      const ngo = ngoPartners.find((n) => n.id === selectedNgo);
      assignDonation(donation.id, { type: "ngo", id: selectedNgo, name: ngo?.name ?? "NGO" });
    } else if (selectedVolunteer) {
      const vol = volunteers.find((v) => v.id === selectedVolunteer);
      assignDonation(donation.id, {
        type: "volunteer",
        id: selectedVolunteer,
        name: vol?.name ?? "Volunteer",
      });
    }
  };

  return (
    <ScreenBackground>
      <ScreenHeader
        title="Donation Review"
        subtitle={`#${donation.id.toUpperCase()}`}
        right={<Badge label={statusMeta.label} tone={statusMeta.tone} />}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: donation.imageUrl }} style={styles.hero} />
          <View style={styles.heroTop}>
            <View style={[styles.catTag, { backgroundColor: Colors.primary }]}>
              <Ionicons name={cat.icon as IoniconName} size={13} color={Colors.white} />
              <Text style={styles.catTagText}>{cat.label}</Text>
            </View>
            <CountdownBadge minutesLeft={donation.minutesLeft} large />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{donation.title}</Text>

          <View style={styles.donorRow}>
            <View style={styles.kindIcon}>
              <Ionicons name={kind.icon as IoniconName} size={18} color={Colors.secondary} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.donorName}>{donation.donorName}</Text>
              <Text style={styles.donorKind}>{kind.label} • {donation.occasion}</Text>
            </View>
          </View>

          <Text style={styles.desc}>{donation.description}</Text>

          {/* Facts grid */}
          <View style={styles.facts}>
            <Fact icon="cube-outline" label="Quantity" value={`${donation.quantity} ${donation.unit}`} />
            <Fact
              icon={donation.prePackaged ? "cube" : "cube-outline"}
              label="Packaging"
              value={donation.prePackaged ? "Pre-parcelled" : "Needs container"}
            />
            <Fact icon="flame-outline" label="Freshness" value={donation.cookedAtLabel} />
            <Fact icon="location-outline" label="Location" value={`${donation.area} • ${donation.distanceKm} km`} />
          </View>

          {/* Location pin mock */}
          <GlassCard style={styles.mapCard} padded={false}>
            <View style={styles.mapCanvas}>
              <View style={styles.road1} />
              <View style={styles.road2} />
              <View style={styles.pin}>
                <Ionicons name="location" size={26} color={Colors.primary} />
              </View>
            </View>
            <View style={styles.mapFooter}>
              <Ionicons name="navigate-outline" size={16} color={Colors.secondary} />
              <Text style={styles.mapFooterText}>{donation.area}, Jaffna • {donation.distanceKm} km away</Text>
            </View>
          </GlassCard>

          {/* Approve / Reject */}
          {!approved && !rejected && (
            <View style={styles.decideRow}>
              <Pressable
                onPress={handleReject}
                style={({ pressed }) => [styles.rejectBtn, pressed && styles.pressed]}
              >
                <Ionicons name="close" size={18} color={Colors.error} />
                <Text style={styles.rejectText}>Reject</Text>
              </Pressable>
              <Pressable
                onPress={handleApprove}
                style={({ pressed }) => [styles.approveBtn, pressed && styles.pressed]}
              >
                <Ionicons name="checkmark" size={18} color={Colors.white} />
                <Text style={styles.approveText}>Approve</Text>
              </Pressable>
            </View>
          )}

          {rejected && (
            <GlassCard style={styles.resultCard}>
              <Ionicons name="close-circle" size={28} color={Colors.error} />
              <Text style={styles.resultTitle}>Donation rejected</Text>
              <Text style={styles.resultDesc}>The donor has been notified.</Text>
            </GlassCard>
          )}

          {/* Assignment section (enabled only after approval) */}
          {approved && (
            <View style={styles.assignSection}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Assign a Volunteer</Text>
                {assigned && <Badge label="Assigned" tone="teal" icon="checkmark" />}
              </View>

              {/* Donor self-delivery toggle */}
              <Pressable
                onPress={() => {
                  setSelfDelivery((v) => !v);
                  setSelectedVolunteer(null);
                  setSelectedNgo(null);
                }}
                disabled={assigned}
                style={[styles.selfRow, selfDelivery && styles.selfRowOn]}
              >
                <View style={styles.selfLeft}>
                  <Ionicons
                    name="car-outline"
                    size={20}
                    color={selfDelivery ? Colors.onPrimary : Colors.secondary}
                  />
                  <Text style={[styles.selfText, selfDelivery && styles.selfTextOn]}>
                    Donor self-delivery
                  </Text>
                </View>
                <View style={[styles.switch, selfDelivery && styles.switchOn]}>
                  <View style={[styles.knob, selfDelivery && styles.knobOn]} />
                </View>
              </Pressable>

              {!selfDelivery && (
                <>
                  <Text style={styles.helper}>Nearby available volunteers, sorted by distance.</Text>
                  {volunteers.map((v) => {
                    const active = selectedVolunteer === v.id;
                    return (
                      <Pressable
                        key={v.id}
                        onPress={() => {
                          setSelectedVolunteer(active ? null : v.id);
                          setSelectedNgo(null);
                        }}
                        disabled={assigned}
                        style={[styles.volCard, active && styles.volCardActive]}
                      >
                        <Image source={{ uri: v.avatarUrl }} style={styles.volAvatar} />
                        <View style={styles.flex}>
                          <Text style={styles.volName}>{v.name}</Text>
                          <View style={styles.volMetaRow}>
                            <Ionicons
                              name={v.hasVehicle ? "bicycle" : "walk"}
                              size={13}
                              color={Colors.onSurfaceVariant}
                            />
                            <Text style={styles.volMeta}>{v.vehicleLabel}</Text>
                            <Text style={styles.volDot}>•</Text>
                            <Text style={styles.volMeta}>{v.activeLoad} active</Text>
                            <Text style={styles.volDot}>•</Text>
                            <Ionicons name="star" size={12} color={Colors.warning} />
                            <Text style={styles.volMeta}>{v.rating}</Text>
                          </View>
                        </View>
                        <View style={styles.volRight}>
                          <Text style={styles.volDist}>{v.distanceKm} km</Text>
                          <View style={[styles.radio, active && styles.radioOn]}>
                            {active && <Ionicons name="checkmark" size={13} color={Colors.white} />}
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}

                  {/* NGO fallback */}
                  <Pressable
                    onPress={() => setNgoOpen((o) => !o)}
                    disabled={assigned}
                    style={styles.ngoToggle}
                  >
                    <Ionicons name="business-outline" size={16} color={Colors.secondary} />
                    <Text style={styles.ngoToggleText}>
                      No rider? Route to a partner NGO
                    </Text>
                    <Ionicons
                      name={ngoOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={Colors.secondary}
                    />
                  </Pressable>

                  {ngoOpen &&
                    ngoPartners.map((n) => {
                      const active = selectedNgo === n.id;
                      return (
                        <Pressable
                          key={n.id}
                          onPress={() => {
                            setSelectedNgo(active ? null : n.id);
                            setSelectedVolunteer(null);
                          }}
                          disabled={assigned}
                          style={[styles.ngoRow, active && styles.ngoRowActive]}
                        >
                          <Ionicons
                            name="business"
                            size={16}
                            color={active ? Colors.onPrimary : Colors.secondary}
                          />
                          <View style={styles.flex}>
                            <Text style={[styles.ngoName, active && styles.ngoNameOn]}>{n.name}</Text>
                            <Text style={[styles.ngoMeta, active && styles.ngoMetaOn]}>
                              {n.area} • {n.activeCases} active cases
                            </Text>
                          </View>
                          {active && <Ionicons name="checkmark" size={16} color={Colors.onPrimary} />}
                        </Pressable>
                      );
                    })}
                </>
              )}

              {assigned ? (
                <GlassCard style={styles.resultCard}>
                  <Ionicons name="checkmark-circle" size={28} color={Colors.secondary} />
                  <Text style={styles.resultTitle}>Assigned & notified</Text>
                  <Text style={styles.resultDesc}>
                    {selfDelivery
                      ? "Donor will self-deliver this donation."
                      : selectedNgo
                        ? `${ngoPartners.find((n) => n.id === selectedNgo)?.name} has been notified.`
                        : selectedVolunteer
                          ? `${volunteers.find((v) => v.id === selectedVolunteer)?.name} has been notified.`
                          : "The donation has been assigned and the handler notified."}
                  </Text>
                  <AppButton
                    label="Back to queue"
                    icon="arrow-back"
                    variant="outline"
                    onPress={() => router.back()}
                    style={styles.backBtn}
                  />
                </GlassCard>
              ) : (
                <AppButton
                  label="Assign & Notify"
                  icon="send"
                  disabled={!canAssign || !assignReady}
                  onPress={handleAssign}
                  style={styles.assignBtn}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function Fact({ icon, label, value }: { icon: IoniconName; label: string; value: string }) {
  return (
    <View style={styles.factCard}>
      <Ionicons name={icon} size={18} color={Colors.secondary} />
      <Text style={styles.factLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  missing: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 32 },
  missingText: { fontSize: 15, color: Colors.onSurfaceVariant, textAlign: "center" },
  scroll: { paddingBottom: 48 },
  heroWrap: { height: 220, width: "100%" },
  hero: { width: "100%", height: "100%", backgroundColor: Colors.surfaceContainerHigh },
  heroTop: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  catTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  catTagText: { fontSize: 12, fontWeight: "700", color: Colors.white },
  content: { paddingHorizontal: Spacing.container, paddingTop: Spacing.lg, gap: 14 },
  title: { fontSize: 23, fontWeight: "700", color: Colors.primary },
  donorRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  kindIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondaryContainer + "66",
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
  donorName: { fontSize: 16, fontWeight: "700", color: Colors.onSurface },
  donorKind: { fontSize: 13, color: Colors.onSurfaceVariant },
  desc: { fontSize: 15, lineHeight: 22, color: Colors.onSurfaceVariant },
  facts: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  factCard: {
    flexGrow: 1,
    flexBasis: "45%",
    backgroundColor: "rgba(255,248,247,0.95)",
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "55",
    padding: 14,
    gap: 6,
  },
  factLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.6, color: Colors.onSurfaceVariant },
  factValue: { fontSize: 15, fontWeight: "700", color: Colors.onSurface },
  mapCard: { overflow: "hidden" },
  mapCanvas: {
    height: 150,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  road1: {
    position: "absolute",
    height: 6,
    width: "160%",
    top: "45%",
    backgroundColor: Colors.secondary + "22",
    transform: [{ rotate: "-12deg" }],
  },
  road2: {
    position: "absolute",
    width: 6,
    height: "160%",
    left: "55%",
    backgroundColor: Colors.secondary + "22",
    transform: [{ rotate: "10deg" }],
  },
  pin: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.primaryContainer,
  },
  mapFooter: { flexDirection: "row", alignItems: "center", gap: 8, padding: 14 },
  mapFooterText: { fontSize: 13, fontWeight: "600", color: Colors.onSurface },
  decideRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 54,
    borderRadius: Radius.button,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  rejectText: { fontSize: 16, fontWeight: "700", color: Colors.error },
  approveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 54,
    borderRadius: Radius.button,
    backgroundColor: Colors.secondary,
  },
  approveText: { fontSize: 16, fontWeight: "700", color: Colors.white },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  resultCard: { alignItems: "center", gap: 6, padding: 24, marginTop: 4 },
  resultTitle: { fontSize: 17, fontWeight: "700", color: Colors.onSurface },
  resultDesc: { fontSize: 14, color: Colors.onSurfaceVariant, textAlign: "center" },
  backBtn: { marginTop: 10 },
  assignSection: { gap: 12, marginTop: 8 },
  sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 19, fontWeight: "700", color: Colors.primary },
  selfRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  selfRowOn: { backgroundColor: Colors.primaryContainer, borderColor: Colors.primaryContainer },
  selfLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  selfText: { fontSize: 15, fontWeight: "700", color: Colors.onSurface },
  selfTextOn: { color: Colors.onPrimary },
  switch: {
    width: 46,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.outlineVariant,
    padding: 3,
    justifyContent: "center",
  },
  switchOn: { backgroundColor: Colors.secondary },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.white },
  knobOn: { alignSelf: "flex-end" },
  helper: { fontSize: 13, color: Colors.onSurfaceVariant },
  volCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  volCardActive: { borderColor: Colors.secondary, backgroundColor: Colors.secondaryContainer + "44" },
  volAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.surfaceContainerHigh },
  volName: { fontSize: 15, fontWeight: "700", color: Colors.onSurface },
  volMetaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  volMeta: { fontSize: 12, color: Colors.onSurfaceVariant, fontWeight: "600" },
  volDot: { fontSize: 12, color: Colors.onSurfaceVariant },
  volRight: { alignItems: "center", gap: 6 },
  volDist: { fontSize: 12, fontWeight: "700", color: Colors.secondary },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.outline,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOn: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  ngoToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.card,
    backgroundColor: Colors.secondaryContainer + "44",
  },
  ngoToggleText: { flex: 1, fontSize: 14, fontWeight: "700", color: Colors.secondary },
  ngoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  ngoRowActive: { backgroundColor: Colors.primaryContainer, borderColor: Colors.primaryContainer },
  ngoName: { fontSize: 14, fontWeight: "700", color: Colors.onSurface },
  ngoNameOn: { color: Colors.onPrimary },
  ngoMeta: { fontSize: 12, color: Colors.onSurfaceVariant },
  ngoMetaOn: { color: Colors.onPrimary + "cc" },
  assignBtn: { marginTop: 6 },
});
