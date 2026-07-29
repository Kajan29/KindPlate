import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "./GlassCard";
import { Colors } from "@constants/index";

interface StatCardProps {
  label: string;
  value: string;
  minWidth?: number;
}

/** Small glass stat tile used in the dashboard header bento. */
export function StatCard({ label, value, minWidth = 96 }: StatCardProps) {
  return (
    <GlassCard style={[styles.card, { minWidth }]} padded={false}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={styles.value}>{value}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: Colors.secondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
});
