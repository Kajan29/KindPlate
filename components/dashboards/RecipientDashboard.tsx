import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../GlassCard";
import { ScreenBackground } from "../ScreenBackground";
import { TopBar } from "../TopBar";
import { AppImages, Colors, Radius, Spacing } from "@constants/index";
import { useUserStore } from "@store/useUserStore";
import { recipientDriver, requestSteps } from "@data/index";

type IoniconName = keyof typeof Ionicons.glyphMap;

const SUPPORT = [
  { icon: "book-outline" as IoniconName, label: "Usage Guidelines" },
  { icon: "help-buoy-outline" as IoniconName, label: "Contact Local Rep" },
];

export function RecipientDashboard() {
  const user = useUserStore((s) => s.user);
  const firstName = user.name.split(" ")[0];
  const doneCount = requestSteps.filter((s) => s.done).length;
  const progressPct = ((doneCount - 1) / (requestSteps.length - 1)) * 100;

  return (
    <ScreenBackground>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TopBar avatarUrl={user.avatarUrl} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <ImageBackground source={AppImages.elderChild} style={styles.hero}>
          <View style={styles.heroOverlay} />
          <View style={styles.heroText}>
            <Text style={styles.heroGreeting}>Good Morning, {firstName}</Text>
            <Text style={styles.heroTitle}>Helping you serve the community today.</Text>
          </View>
        </ImageBackground>

        {/* Request Food CTA (overlaps hero) */}
        <View style={styles.ctaWrap}>
          <Pressable style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
            <View style={styles.ctaLeft}>
              <View style={styles.ctaIcon}>
                <Ionicons name="hand-left" size={30} color={Colors.white} />
              </View>
              <View>
                <Text style={styles.ctaTitle}>Request Food</Text>
                <Text style={styles.ctaSub}>Simple 2-step process</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={28} color={Colors.onPrimaryContainer} />
          </Pressable>
        </View>

        {/* Live request status */}
        <GlassCard style={styles.statusCard}>
          <View style={styles.statusHead}>
            <Text style={styles.statusTitle}>Live Request Status</Text>
            <View style={styles.activePill}>
              <Text style={styles.activeText}>ACTIVE</Text>
            </View>
          </View>

          <View style={styles.tracker}>
            <View style={styles.trackLineBg} />
            <View style={[styles.trackLineActive, { width: `${progressPct}%` }]} />
            {requestSteps.map((step) => (
              <View key={step.key} style={styles.step}>
                <View style={[styles.stepDot, step.done ? styles.stepDone : styles.stepTodo]}>
                  <Ionicons
                    name={step.icon as IoniconName}
                    size={20}
                    color={step.done ? Colors.white : Colors.outline}
                  />
                </View>
                <Text style={[styles.stepLabel, step.done && styles.stepLabelDone]}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.driver}>
            <Image source={{ uri: recipientDriver.avatarUrl }} style={styles.driverAvatar} />
            <View style={styles.flex}>
              <Text style={styles.driverName}>Driver: {recipientDriver.name}</Text>
              <Text style={styles.driverEta}>{recipientDriver.etaLabel}</Text>
            </View>
            <Pressable style={styles.callBtn} accessibilityLabel="Call driver">
              <Ionicons name="call" size={18} color={Colors.white} />
            </Pressable>
          </View>
        </GlassCard>

        {/* Info bento */}
        <View style={styles.bento}>
          <GlassCard style={styles.bentoCard}>
            <Ionicons name="restaurant" size={28} color={Colors.secondary} />
            <Text style={styles.bentoTitle}>Meal Quality Guarantee</Text>
            <Text style={styles.bentoDesc}>
              All food is checked for safety by the Jaffna Health Dept.
            </Text>
          </GlassCard>
          <View style={[styles.bentoCard, styles.bentoSage]}>
            <Ionicons name="leaf" size={28} color={Colors.white} />
            <Text style={styles.bentoTitleLight}>42 kg Saved</Text>
            <Text style={styles.bentoDescLight}>Food you've helped redirect this month.</Text>
          </View>
        </View>

        {/* Support */}
        <Text style={styles.supportTitle}>Support & Help</Text>
        <View style={styles.support}>
          {SUPPORT.map((s) => (
            <Pressable
              key={s.label}
              style={({ pressed }) => [styles.supportRow, pressed && styles.pressed]}
            >
              <View style={styles.supportLeft}>
                <Ionicons name={s.icon} size={22} color={Colors.secondary} />
                <Text style={styles.supportLabel}>{s.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.onSurfaceVariant} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerSafe: { backgroundColor: "rgba(255,248,247,0.82)" },
  scroll: { paddingBottom: 120 },
  hero: { height: 320, justifyContent: "flex-end" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(48,1,18,0.35)",
  },
  heroText: { padding: Spacing.container, paddingBottom: 48 },
  heroGreeting: { fontSize: 18, fontWeight: "600", color: "rgba(255,255,255,0.92)", marginBottom: 4 },
  heroTitle: { fontSize: 28, fontWeight: "700", color: Colors.white, maxWidth: 260, lineHeight: 34 },
  ctaWrap: { paddingHorizontal: Spacing.container, marginTop: -32 },
  cta: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.xl,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.95 },
  ctaLeft: { flexDirection: "row", alignItems: "center", gap: 16 },
  ctaIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaTitle: { fontSize: 20, fontWeight: "700", color: Colors.onPrimaryContainer },
  ctaSub: { fontSize: 13, color: Colors.onPrimaryContainer, opacity: 0.8 },
  statusCard: { margin: Spacing.container, padding: 20 },
  statusHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statusTitle: { fontSize: 20, fontWeight: "700", color: Colors.primary },
  activePill: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  activeText: { fontSize: 10, fontWeight: "700", letterSpacing: 1, color: Colors.onSecondaryContainer },
  tracker: { flexDirection: "row", justifyContent: "space-between", position: "relative" },
  trackLineBg: {
    position: "absolute",
    top: 24,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: Colors.outlineVariant + "66",
  },
  trackLineActive: {
    position: "absolute",
    top: 24,
    left: 12,
    height: 2,
    backgroundColor: Colors.secondary,
  },
  step: { alignItems: "center", gap: 8, width: 60 },
  stepDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDone: { backgroundColor: Colors.secondary },
  stepTodo: {
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.outline,
    textTransform: "uppercase",
  },
  stepLabelDone: { color: Colors.secondary },
  driver: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.secondaryContainer + "4D",
    borderRadius: Radius.card,
    padding: 12,
    marginTop: 24,
  },
  driverAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceContainerHigh },
  flex: { flex: 1 },
  driverName: { fontSize: 14, fontWeight: "700", color: Colors.onSecondaryContainer },
  driverEta: { fontSize: 12, color: Colors.onSecondaryContainer, opacity: 0.8 },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  bento: { flexDirection: "row", gap: 12, paddingHorizontal: Spacing.container },
  bentoCard: { flex: 1, padding: 18, gap: 10, borderRadius: Radius.xl },
  bentoSage: { backgroundColor: Colors.secondary },
  bentoTitle: { fontSize: 15, fontWeight: "700", color: Colors.onSurface },
  bentoDesc: { fontSize: 12, color: Colors.onSurfaceVariant },
  bentoTitleLight: { fontSize: 16, fontWeight: "700", color: Colors.white },
  bentoDescLight: { fontSize: 12, color: "rgba(255,255,255,0.85)" },
  supportTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    paddingHorizontal: Spacing.container,
    marginTop: 28,
    marginBottom: 14,
  },
  support: { paddingHorizontal: Spacing.container, gap: 12 },
  supportRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "44",
    padding: 16,
  },
  supportLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  supportLabel: { fontSize: 15, fontWeight: "700", color: Colors.onSurface },
});
