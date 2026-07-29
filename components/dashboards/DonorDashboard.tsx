import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppButton } from "../AppButton";
import { DonationCard } from "../DonationCard";
import { GlassCard } from "../GlassCard";
import { SectionHeader } from "../SectionHeader";
import { StatCard } from "../StatCard";
import { TopBar } from "../TopBar";
import { AppImages, Colors, Radius, Spacing } from "@constants/index";
import { useDonationStore } from "@store/useDonationStore";
import { useUserStore } from "@store/useUserStore";
import { hotspots } from "@data/index";

export function DonorDashboard() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const donations = useDonationStore((s) => s.donations);
  const firstName = user.name.split(" ")[0];
  const topHotspot = hotspots[0];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TopBar avatarUrl={user.avatarUrl} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingText}>
          <Text style={styles.greeting}>Vanakkam, {firstName} 👋</Text>
          <Text style={styles.subGreeting}>Ready to make a difference in Jaffna today?</Text>
        </View>
        <View style={styles.stats}>
          <StatCard label="Points" value={user.points.toLocaleString()} />
          <StatCard label="Rank" value={user.rank} />
          <StatCard label="Meals" value={`${user.mealsShared}`} />
        </View>

        <ImageBackground
          source={AppImages.communityMeal}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroKicker}>SHARE YOUR SURPLUS</Text>
            <AppButton
              label="Post New Donation"
              icon="add-circle"
              fullWidth={false}
              onPress={() => router.push("/(tabs)/donate")}
              style={styles.heroBtn}
            />
          </View>
        </ImageBackground>

        <View style={styles.section}>
          <SectionHeader title="My Active Donations" actionLabel="View All" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        >
          {donations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              horizontal
              onPress={() => router.push(`/donation/${donation.id}`)}
            />
          ))}
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.hotspotHeader}>
            <Text style={styles.sectionTitle}>Demand Hotspots</Text>
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live Heatmap</Text>
            </View>
          </View>

          <View style={styles.mapPreview}>
            <View style={[styles.heat, styles.heatA]} />
            <View style={[styles.heat, styles.heatB]} />
            <View style={styles.road1} />
            <View style={styles.road2} />

            <GlassCard style={styles.floatingCard}>
              <View style={styles.floatingRow}>
                <View style={styles.floatingIcon}>
                  <Ionicons name="trending-up" size={20} color={Colors.onSecondaryContainer} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.floatingKicker}>HIGH DEMAND AREA</Text>
                  <Text style={styles.floatingTitle}>
                    {topHotspot.area} Region: {topHotspot.requestsPending} Requests Pending
                  </Text>
                </View>
              </View>
            </GlassCard>
          </View>

          <AppButton
            label="Open Kindness Map"
            variant="outline"
            icon="map-outline"
            onPress={() => router.push("/(tabs)/map")}
            style={styles.mapBtn}
          />
        </View>
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
  greetingText: { gap: 4, marginBottom: 16 },
  greeting: { fontSize: 28, fontWeight: "700", color: Colors.primary },
  subGreeting: { fontSize: 15, color: Colors.onSurfaceVariant },
  stats: { flexDirection: "row", gap: 12, marginBottom: 24 },
  hero: {
    height: 200,
    borderRadius: Radius.xl,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginBottom: 28,
  },
  heroImage: { borderRadius: Radius.xl },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(48,1,18,0.5)" },
  heroContent: { padding: 20, gap: 12 },
  heroKicker: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
    opacity: 0.9,
  },
  heroBtn: { alignSelf: "flex-start", height: 52 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: Colors.secondary },
  carousel: { gap: 14, paddingRight: 8, paddingBottom: 8, marginBottom: 16 },
  hotspotHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  liveRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error },
  liveText: { fontSize: 13, fontWeight: "700", color: Colors.secondary },
  mapPreview: {
    height: 200,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "55",
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heat: { position: "absolute", borderRadius: 999 },
  heatA: { width: 130, height: 130, top: 20, left: 40, backgroundColor: "rgba(186,26,26,0.18)" },
  heatB: { width: 150, height: 150, bottom: 30, right: 20, backgroundColor: "rgba(186,26,26,0.14)" },
  road1: {
    position: "absolute",
    height: 6,
    width: "140%",
    top: 90,
    left: -20,
    backgroundColor: Colors.secondary + "22",
    transform: [{ rotate: "-12deg" }],
  },
  road2: {
    position: "absolute",
    width: 6,
    height: "140%",
    left: "48%",
    top: -20,
    backgroundColor: Colors.secondary + "22",
    transform: [{ rotate: "8deg" }],
  },
  floatingCard: { margin: 12 },
  floatingRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  floatingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
  floatingKicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: Colors.secondary,
  },
  floatingTitle: { fontSize: 14, fontWeight: "700", color: Colors.primary },
  mapBtn: { marginTop: 16 },
});
