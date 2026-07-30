import { StyleSheet, Text } from "react-native";
import { GlassCard } from "./GlassCard";
import { Colors, fontScale, moderateScale } from "@constants/index";

interface StatCardProps {
  label: string;
  value: string;
  minWidth?: number;
}

/** Small glass stat tile used in the dashboard header bento. */
export function StatCard({ label, value, minWidth = moderateScale(96) }: StatCardProps) {
  return (
    <GlassCard style={[styles.card, { minWidth }]} padded={false}>
      <Text style={styles.label} numberOfLines={1}>
        {label.toUpperCase()}
      </Text>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: fontScale(11),
    fontWeight: "700",
    letterSpacing: 0.6,
    color: Colors.secondary,
    marginBottom: moderateScale(4),
  },
  value: {
    fontSize: fontScale(20),
    fontWeight: "700",
    color: Colors.primary,
  },
});
