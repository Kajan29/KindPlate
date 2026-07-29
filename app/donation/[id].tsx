import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppButton, Badge, GlassCard, ScreenHeader } from "@components/index";
import { Colors, Radius, Spacing } from "@constants/index";
import { useDonationStore } from "@store/useDonationStore";
import { CATEGORY_META } from "@data/index";
import { DonationStatus } from "@/types/food";

const STATUS_TONE: Record<DonationStatus, "warning" | "sage" | "teal" | "neutral"> = {
  pending: "warning",
  assigned: "sage",
  in_transit: "teal",
  delivered: "sage",
  expired: "neutral",
};

export default function DonationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const donations = useDonationStore((s) => s.donations);
  const history = useDonationStore((s) => s.history);
  const updateStatus = useDonationStore((s) => s.updateStatus);

  const donation = [...donations, ...history].find((d) => d.id === id);

  if (!donation) {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Donation" />
        <View style={styles.missing}>
          <Ionicons name="fast-food-outline" size={48} color={Colors.outline} />
          <Text style={styles.missingText}>This donation could not be found.</Text>
        </View>
      </View>
    );
  }

  const meta = CATEGORY_META[donation.category];
  const canAssign = donation.status === "pending";

  return (
    <View style={styles.root}>
      <ScreenHeader title="Donation Details" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: donation.imageUrl }} style={styles.image} />
          <View style={styles.statusBadge}>
            <Badge label={donation.status.replace("_", " ")} tone={STATUS_TONE[donation.status]} />
          </View>
        </View>

        <Text style={styles.title}>{donation.title}</Text>
        <View style={styles.chips}>
          <Badge label={meta.label} tone="teal" icon={meta.icon as keyof typeof Ionicons.glyphMap} />
          <Badge label={`${donation.quantity} ${donation.unit}`} tone="sage" />
        </View>
        <Text style={styles.desc}>{donation.description}</Text>

        <GlassCard style={styles.infoCard}>
          <InfoRow icon="time-outline" label="Freshness" value={donation.expiresInLabel} />
          <InfoRow
            icon="location-outline"
            label="Pickup area"
            value={`${donation.location.area}, ${donation.location.city}`}
          />
          {donation.location.distanceKm ? (
            <InfoRow icon="navigate-outline" label="Distance" value={`${donation.location.distanceKm} km away`} />
          ) : null}
        </GlassCard>

        <GlassCard style={styles.donorCard}>
          <Image source={{ uri: donation.donor.avatarUrl }} style={styles.donorAvatar} />
          <View style={styles.flex}>
            <Text style={styles.donorLabel}>DONATED BY</Text>
            <Text style={styles.donorName}>{donation.donor.name}</Text>
          </View>
          <View style={styles.verified}>
            <Ionicons name="shield-checkmark" size={16} color={Colors.secondary} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </GlassCard>

        {canAssign ? (
          <AppButton
            label="Assign a Volunteer"
            icon="bicycle"
            onPress={() => updateStatus(donation.id, "assigned")}
            style={styles.action}
          />
        ) : donation.status === "assigned" ? (
          <AppButton
            label="Mark as Delivered"
            icon="checkmark-done"
            variant="secondary"
            onPress={() => updateStatus(donation.id, "delivered")}
            style={styles.action}
          />
        ) : (
          <View style={styles.doneRow}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.secondary} />
            <Text style={styles.doneText}>This donation is {donation.status.replace("_", " ")}.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={Colors.secondary} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.container, paddingBottom: 40 },
  missing: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  missingText: { fontSize: 15, color: Colors.onSurfaceVariant },
  imageWrap: { borderRadius: Radius.xl, overflow: "hidden", height: 220, marginBottom: 18 },
  image: { width: "100%", height: "100%", backgroundColor: Colors.surfaceContainerHigh },
  statusBadge: { position: "absolute", top: 12, right: 12 },
  title: { fontSize: 24, fontWeight: "700", color: Colors.primary, marginBottom: 10 },
  chips: { flexDirection: "row", gap: 8, marginBottom: 14 },
  desc: { fontSize: 15, color: Colors.onSurfaceVariant, lineHeight: 22, marginBottom: 20 },
  infoCard: { padding: 8, marginBottom: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 10 },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondaryContainer + "66",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: { flex: 1, fontSize: 14, color: Colors.onSurfaceVariant },
  infoValue: { fontSize: 14, fontWeight: "700", color: Colors.onSurface },
  donorCard: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 24 },
  donorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  flex: { flex: 1 },
  donorLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.6, color: Colors.onSurfaceVariant },
  donorName: { fontSize: 16, fontWeight: "700", color: Colors.onSurface },
  verified: { flexDirection: "row", alignItems: "center", gap: 4 },
  verifiedText: { fontSize: 12, fontWeight: "700", color: Colors.secondary },
  action: {},
  doneRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    backgroundColor: Colors.secondaryContainer + "4D",
    borderRadius: Radius.card,
  },
  doneText: { fontSize: 14, fontWeight: "600", color: Colors.onSecondaryContainer },
});
