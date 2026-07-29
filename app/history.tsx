import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { DonationCard, GlassCard, ScreenHeader } from "@components/index";
import { Colors, Spacing } from "@constants/index";
import { useDonationStore } from "@store/useDonationStore";

export default function HistoryScreen() {
  const router = useRouter();
  const donations = useDonationStore((s) => s.donations);
  const history = useDonationStore((s) => s.history);

  const totalMeals = [...donations, ...history].reduce((sum, d) => sum + d.quantity, 0);

  return (
    <View style={styles.root}>
      <ScreenHeader title="My Donations" subtitle={`${donations.length + history.length} contributions`} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{donations.length}</Text>
            <Text style={styles.summaryLabel}>ACTIVE</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{history.length}</Text>
            <Text style={styles.summaryLabel}>COMPLETED</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalMeals}</Text>
            <Text style={styles.summaryLabel}>ITEMS SHARED</Text>
          </View>
        </GlassCard>

        <Text style={styles.section}>Active</Text>
        {donations.map((d) => (
          <DonationCard
            key={d.id}
            donation={d}
            onPress={() => router.push(`/donation/${d.id}`)}
          />
        ))}

        <Text style={styles.section}>Completed</Text>
        {history.map((d) => (
          <DonationCard
            key={d.id}
            donation={d}
            onPress={() => router.push(`/donation/${d.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.container, paddingBottom: 40 },
  summary: { flexDirection: "row", alignItems: "center", padding: 18, marginBottom: 20 },
  summaryItem: { flex: 1, alignItems: "center", gap: 4 },
  summaryValue: { fontSize: 24, fontWeight: "700", color: Colors.primary },
  summaryLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.6, color: Colors.onSurfaceVariant },
  summaryDivider: { width: 1, height: 36, backgroundColor: Colors.outlineVariant + "66" },
  section: { fontSize: 18, fontWeight: "700", color: Colors.secondary, marginBottom: 14, marginTop: 4 },
});
