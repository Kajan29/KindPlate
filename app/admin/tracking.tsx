import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Badge, GlassCard, ScreenHeader } from "@components/index";
import { Colors, Radius, Spacing } from "@constants/index";
import { useAdminStore } from "@store/useAdminStore";

type IoniconName = keyof typeof Ionicons.glyphMap;

const STEPS: { label: string; icon: IoniconName }[] = [
  { label: "Posted", icon: "create-outline" },
  { label: "Approved", icon: "checkmark-circle-outline" },
  { label: "Assigned", icon: "person-outline" },
  { label: "Collected", icon: "cube-outline" },
  { label: "Delivered", icon: "bicycle-outline" },
];

export default function TrackingScreen() {
  const deliveries = useAdminStore((s) => s.deliveries);
  return (
    <View style={styles.root}>
      <ScreenHeader title="Delivery Tracking" subtitle="Lifecycle & proof-of-delivery" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {deliveries.map((d) => (
          <GlassCard key={d.id} style={styles.card}>
            <View style={styles.head}>
              <View style={styles.flex}>
                <Text style={styles.title}>{d.title}</Text>
                <Text style={styles.meta}>#{d.id.toUpperCase()} • {d.updatedAgoLabel}</Text>
              </View>
              {d.flagged ? (
                <Badge label="Flagged" tone="error" icon="flag" />
              ) : d.currentStep >= STEPS.length - 1 ? (
                <Badge label="Delivered" tone="sage" icon="checkmark" />
              ) : (
                <Badge label="In progress" tone="teal" icon="time" />
              )}
            </View>

            {/* Stepper */}
            <View style={styles.stepper}>
              {STEPS.map((s, i) => {
                const done = i <= d.currentStep;
                const current = i === d.currentStep;
                return (
                  <View key={s.label} style={styles.step}>
                    <View style={styles.stepTop}>
                      {i > 0 && (
                        <View style={[styles.line, i <= d.currentStep && styles.lineDone]} />
                      )}
                      <View
                        style={[
                          styles.node,
                          done && styles.nodeDone,
                          current && styles.nodeCurrent,
                        ]}
                      >
                        <Ionicons
                          name={s.icon}
                          size={15}
                          color={done ? Colors.white : Colors.onSurfaceVariant}
                        />
                      </View>
                      {i < STEPS.length - 1 && (
                        <View style={[styles.line, i < d.currentStep && styles.lineDone]} />
                      )}
                    </View>
                    <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{s.label}</Text>
                  </View>
                );
              })}
            </View>

            {/* Parties */}
            <View style={styles.parties}>
              <Party icon="storefront-outline" label="Donor" value={d.donor} />
              <Party icon="bicycle-outline" label="Volunteer" value={d.volunteer} />
              <Party icon="home-outline" label="Recipient" value={d.recipient} />
            </View>

            {/* Proof of delivery / flag */}
            {d.proofPhoto ? (
              <View style={styles.proofWrap}>
                <Text style={styles.proofLabel}>PROOF OF DELIVERY</Text>
                <Image source={{ uri: d.proofPhoto }} style={styles.proof} />
              </View>
            ) : d.flagged ? (
              <View style={styles.flagNote}>
                <Ionicons name="warning-outline" size={16} color={Colors.onErrorContainer} />
                <Text style={styles.flagText}>
                  No status update in over an hour — follow up with the volunteer.
                </Text>
              </View>
            ) : null}
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
}

function Party({ icon, label, value }: { icon: IoniconName; label: string; value: string }) {
  return (
    <View style={styles.party}>
      <Ionicons name={icon} size={16} color={Colors.secondary} />
      <View style={styles.flex}>
        <Text style={styles.partyLabel}>{label}</Text>
        <Text style={styles.partyValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.container, paddingTop: 16, paddingBottom: 40, gap: 16 },
  card: { gap: 18 },
  head: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  flex: { flex: 1 },
  title: { fontSize: 17, fontWeight: "700", color: Colors.primary },
  meta: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  stepper: { flexDirection: "row" },
  step: { flex: 1, alignItems: "center", gap: 6 },
  stepTop: { flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "center" },
  line: { flex: 1, height: 3, backgroundColor: Colors.outlineVariant },
  lineDone: { backgroundColor: Colors.secondary },
  node: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeDone: { backgroundColor: Colors.secondary },
  nodeCurrent: { backgroundColor: Colors.primary },
  stepLabel: { fontSize: 10, fontWeight: "600", color: Colors.onSurfaceVariant },
  stepLabelDone: { color: Colors.onSurface },
  parties: { gap: 10 },
  party: { flexDirection: "row", alignItems: "center", gap: 10 },
  partyLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, color: Colors.onSurfaceVariant },
  partyValue: { fontSize: 14, fontWeight: "600", color: Colors.onSurface },
  proofWrap: { gap: 8 },
  proofLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.6, color: Colors.onSurfaceVariant },
  proof: {
    width: "100%",
    height: 150,
    borderRadius: Radius.card,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  flagNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.errorContainer,
    borderRadius: Radius.card,
    padding: 12,
  },
  flagText: { flex: 1, fontSize: 13, color: Colors.onErrorContainer, lineHeight: 18 },
});
