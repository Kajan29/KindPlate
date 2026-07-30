import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Shadows, fontScale, moderateScale } from "@constants/index";
import { Donation, DonationStatus } from "@/types/food";
import { Badge } from "./Badge";

interface DonationCardProps {
  donation: Donation;
  onPress?: () => void;
  /** Fixed-width card for horizontal carousels. */
  horizontal?: boolean;
}

const STATUS_META: Record<
  DonationStatus,
  { label: string; tone: "warning" | "sage" | "teal" | "neutral" | "maroon" }
> = {
  pending: { label: "Pending", tone: "warning" },
  assigned: { label: "Assigned", tone: "sage" },
  in_transit: { label: "In Transit", tone: "teal" },
  delivered: { label: "Delivered", tone: "sage" },
  expired: { label: "Expired", tone: "neutral" },
};

export function DonationCard({ donation, onPress, horizontal = false }: DonationCardProps) {
  const status = STATUS_META[donation.status];
  const metaIcon =
    donation.status === "assigned" || donation.status === "in_transit"
      ? "bicycle"
      : donation.status === "delivered"
        ? "checkmark-done"
        : "time-outline";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${donation.title}, ${status.label}, ${donation.expiresInLabel}`}
      style={({ pressed }) => [
        styles.card,
        horizontal ? styles.horizontal : styles.full,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: donation.imageUrl }} style={styles.image} />
        <View style={styles.badgeWrap}>
          <Badge label={status.label} tone={status.tone} />
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {donation.title}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name={metaIcon} size={moderateScale(16)} color={Colors.onSurfaceVariant} />
          <Text style={styles.meta} numberOfLines={1}>
            {donation.expiresInLabel}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={moderateScale(14)} color={Colors.secondary} />
          <Text style={styles.location} numberOfLines={1}>
            {donation.location.area}
            {donation.location.distanceKm
              ? ` • ${donation.location.distanceKm} km`
              : ""}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,248,247,0.95)",
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "55",
    overflow: "hidden",
    ...Shadows.soft,
  },
  horizontal: {
    width: moderateScale(260),
  },
  full: {
    width: "100%",
    marginBottom: moderateScale(14),
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  imageWrap: {
    height: moderateScale(132),
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.surfaceContainerHigh,
  },
  badgeWrap: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  body: {
    padding: moderateScale(14),
    gap: moderateScale(6),
  },
  title: {
    fontSize: fontScale(16),
    fontWeight: "700",
    color: Colors.primary,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
  },
  meta: {
    fontSize: fontScale(13),
    color: Colors.onSurfaceVariant,
    flexShrink: 1,
  },
  location: {
    fontSize: fontScale(12),
    color: Colors.secondary,
    fontWeight: "600",
    flexShrink: 1,
  },
});
