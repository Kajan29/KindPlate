import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../GlassCard";
import { TopBar } from "../TopBar";
import { AppImages, Colors, Radius, Spacing } from "@constants/index";
import { useUserStore } from "@store/useUserStore";
import { volunteerPickups, volunteerRoute } from "@data/index";
import { FreshnessLevel } from "@/types/food";

const FRESHNESS: Record<FreshnessLevel, { color: string; label: string }> = {
  fresh: { color: Colors.secondary, label: "FRESH" },
  urgent: { color: "#c98a00", label: "URGENT" },
  expired: { color: Colors.error, label: "EXPIRED" },
};

export function VolunteerDashboard() {
  const user = useUserStore((s) => s.user);
  const firstName = user.name.split(" ")[0];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TopBar avatarUrl={user.avatarUrl} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <ImageBackground
          source={AppImages.volunteerDelivery}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroRow}>
            <View style={styles.flex}>
              <Text style={styles.heroTitle}>Hello, {firstName}</Text>
              <Text style={styles.heroSub}>
                {volunteerRoute.pickupsToday} Pickups • {volunteerRoute.routeKm}km Route Today
              </Text>
            </View>
            <View style={styles.locChip}>
              <Ionicons name="location" size={16} color={Colors.secondary} />
              <Text style={styles.locText}>{volunteerRoute.currentArea}</Text>
            </View>
          </View>
        </ImageBackground>

        {/* Assigned pickups */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Today's Assigned Pickups</Text>
          <View style={styles.activePill}>
            <Text style={styles.activeText}>Active</Text>
          </View>
        </View>

        <View style={styles.pickupList}>
          {volunteerPickups.map((p) => {
            const fresh = FRESHNESS[p.freshnessLevel];
            return (
              <GlassCard key={p.id} style={styles.pickupCard}>
                <View style={styles.pickupRow}>
                  <Image source={{ uri: p.imageUrl }} style={styles.pickupImg} />
                  <View style={styles.pickupBody}>
                    <Text style={styles.pickupOrg}>{p.org}</Text>
                    <View style={styles.distanceRow}>
                      <Ionicons name="navigate-outline" size={13} color={Colors.onSurfaceVariant} />
                      <Text style={styles.distance}>{p.distanceKm} km away</Text>
                    </View>
                    <View style={styles.tagRow}>
                      {p.tags.map((t) => (
                        <View key={t} style={styles.tag}>
                          <Text style={styles.tagText}>{t.toUpperCase()}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.timerCol}>
                    <View style={[styles.timer, { borderColor: fresh.color }]}>
                      <Text style={[styles.timerText, { color: fresh.color }]}>
                        {p.freshnessLabel}
                      </Text>
                    </View>
                    <Text style={styles.freshLabel}>{fresh.label}</Text>
                  </View>
                </View>
              </GlassCard>
            );
          })}
        </View>

        {/* Monthly impact */}
        <View style={styles.impactCard}>
          <Text style={styles.impactTitle}>Monthly Impact</Text>
          <Text style={styles.impactSub}>
            You've helped feed {volunteerRoute.peopleFed} people this month.
          </Text>
          <View style={styles.impactStats}>
            <View style={styles.impactStat}>
              <Text style={styles.impactValue}>{volunteerRoute.foodSavedKg}kg</Text>
              <Text style={styles.impactLabel}>FOOD SAVED</Text>
            </View>
            <View style={styles.impactStat}>
              <Text style={styles.impactValue}>{volunteerRoute.deliveries}</Text>
              <Text style={styles.impactLabel}>DELIVERIES</Text>
            </View>
          </View>
          <Ionicons
            name="bicycle"
            size={140}
            color={Colors.white}
            style={styles.impactWatermark}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerSafe: { backgroundColor: "rgba(255,248,247,0.92)" },
  scroll: { paddingBottom: 120 },
  hero: { height: 240, justifyContent: "flex-end" },
  heroImage: {},
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(48,1,18,0.35)",
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: Spacing.container,
    gap: 12,
  },
  flex: { flex: 1 },
  heroTitle: { fontSize: 22, fontWeight: "700", color: Colors.white, marginBottom: 4 },
  heroSub: { fontSize: 14, fontWeight: "600", color: "rgba(255,255,255,0.92)" },
  locChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,248,247,0.95)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  locText: { fontSize: 13, fontWeight: "700", color: Colors.secondary },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.container,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: Colors.primary },
  activePill: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  activeText: { fontSize: 12, fontWeight: "700", color: Colors.onSecondaryContainer },
  pickupList: { paddingHorizontal: Spacing.container, gap: 14 },
  pickupCard: { padding: 14 },
  pickupRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  pickupImg: {
    width: 76,
    height: 76,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  pickupBody: { flex: 1, gap: 6 },
  pickupOrg: { fontSize: 16, fontWeight: "700", color: Colors.onSurface },
  distanceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  distance: { fontSize: 13, color: Colors.onSurfaceVariant },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    backgroundColor: Colors.secondaryContainer + "80",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: Colors.onSecondaryContainer,
  },
  timerCol: { alignItems: "center", gap: 4 },
  timer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  timerText: { fontSize: 12, fontWeight: "700" },
  freshLabel: { fontSize: 9, fontWeight: "700", color: Colors.outline },
  impactCard: {
    margin: Spacing.container,
    marginTop: 24,
    backgroundColor: Colors.secondary,
    borderRadius: Radius.xl,
    padding: 24,
    overflow: "hidden",
  },
  impactTitle: { fontSize: 20, fontWeight: "700", color: Colors.white, marginBottom: 6 },
  impactSub: { fontSize: 14, color: "rgba(255,255,255,0.9)", marginBottom: 20 },
  impactStats: { flexDirection: "row", gap: 12 },
  impactStat: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: Radius.input,
    padding: 14,
  },
  impactValue: { fontSize: 24, fontWeight: "700", color: Colors.white },
  impactLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  impactWatermark: {
    position: "absolute",
    right: -20,
    bottom: -20,
    opacity: 0.12,
  },
});
