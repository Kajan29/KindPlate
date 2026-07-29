import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard, TopBar } from "@components/index";
import LiveMap, { type LiveMapMarker } from "@components/LiveMap";
import { Colors, Radius, Spacing } from "@constants/index";
import { useUserStore } from "@store/useUserStore";
import { heatZones } from "@data/index";
import { HeatZone } from "@/types/food";

type IoniconName = keyof typeof Ionicons.glyphMap;
type ViewMode = "map" | "list";

const AVG_FAMILY_SIZE = 4.2;

function levelColor(level: HeatZone["level"]) {
  return level === "high" ? Colors.error : Colors.primary;
}

export default function DemandScreen() {
  const user = useUserStore((s) => s.user);
  const [mode, setMode] = useState<ViewMode>("map");
  const [selected, setSelected] = useState<string>(heatZones[0]?.id ?? "");

  const ranked = [...heatZones].sort((a, b) => b.families - a.families);
  const active = heatZones.find((z) => z.id === selected) ?? heatZones[0];
  const totalPeople = active ? Math.round(active.families * AVG_FAMILY_SIZE) : 0;
  const openRequests = active ? Math.max(1, Math.round(active.families / 8)) : 0;

  const markers: LiveMapMarker[] = ranked.map((z) => ({
    id: z.id,
    latitude: z.latitude,
    longitude: z.longitude,
    color: levelColor(z.level),
    icon: "people",
    title: z.area,
    description: `${z.families} families • ${z.level === "high" ? "High demand" : "Moderate"}`,
    emphasize: z.level === "high",
  }));

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TopBar avatarUrl={user.avatarUrl} />
      </SafeAreaView>

      <View style={styles.titleRow}>
        <View style={styles.flex}>
          <Text style={styles.title}>Demand Heatmap</Text>
          <Text style={styles.subtitle}>Where help is needed most, right now.</Text>
        </View>
        <View style={styles.toggle}>
          <Pressable
            onPress={() => setMode("map")}
            style={[styles.toggleBtn, mode === "map" && styles.toggleBtnActive]}
          >
            <Ionicons name="map" size={16} color={mode === "map" ? Colors.onPrimary : Colors.secondary} />
          </Pressable>
          <Pressable
            onPress={() => setMode("list")}
            style={[styles.toggleBtn, mode === "list" && styles.toggleBtnActive]}
          >
            <Ionicons name="list" size={18} color={mode === "list" ? Colors.onPrimary : Colors.secondary} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {mode === "map" ? (
          <>
            <View style={styles.mapCanvas}>
              <LiveMap markers={markers} activeId={active?.id ?? ""} onSelect={setSelected} />

              <View style={styles.legend} pointerEvents="none">
                <View style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: Colors.error }]} />
                  <Text style={styles.legendText}>High demand</Text>
                </View>
                <View style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
                  <Text style={styles.legendText}>Moderate</Text>
                </View>
              </View>
            </View>

            {/* Selected zone stats */}
            {active && (
              <GlassCard style={styles.zoneCard}>
                <View style={styles.zoneHead}>
                  <View style={[styles.zoneBadge, { backgroundColor: levelColor(active.level) }]}>
                    <Ionicons name="flame" size={16} color={Colors.white} />
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.zoneName}>{active.area}</Text>
                    <Text style={styles.zoneLevel}>
                      {active.level === "high" ? "High-demand zone" : "Moderate demand"}
                    </Text>
                  </View>
                </View>
                <View style={styles.zoneStats}>
                  <ZoneStat icon="home" label="Families" value={`${active.families}`} />
                  <ZoneStat icon="people" label="People" value={`${totalPeople}`} />
                  <ZoneStat icon="resize" label="Avg family" value={`${AVG_FAMILY_SIZE}`} />
                  <ZoneStat icon="megaphone" label="Open reqs" value={`${openRequests}`} />
                </View>
              </GlassCard>
            )}
          </>
        ) : (
          <View style={styles.list}>
            {ranked.map((z, i) => {
              const people = Math.round(z.families * AVG_FAMILY_SIZE);
              return (
                <Pressable
                  key={z.id}
                  onPress={() => {
                    setSelected(z.id);
                    setMode("map");
                  }}
                >
                  <GlassCard style={styles.listCard}>
                    <View style={styles.rankNum}>
                      <Text style={styles.rankNumText}>{i + 1}</Text>
                    </View>
                    <View style={styles.flex}>
                      <Text style={styles.listArea}>{z.area}</Text>
                      <Text style={styles.listMeta}>
                        {z.families} families • ~{people} people
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.levelPill,
                        { backgroundColor: z.level === "high" ? Colors.errorContainer : Colors.secondaryContainer },
                      ]}
                    >
                      <Text
                        style={[
                          styles.levelPillText,
                          { color: z.level === "high" ? Colors.onErrorContainer : Colors.onSecondaryContainer },
                        ]}
                      >
                        {z.level === "high" ? "HIGH" : "MOD"}
                      </Text>
                    </View>
                  </GlassCard>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function ZoneStat({ icon, label, value }: { icon: IoniconName; label: string; value: string }) {
  return (
    <View style={styles.zoneStat}>
      <Ionicons name={icon} size={16} color={Colors.secondary} />
      <Text style={styles.zoneStatValue}>{value}</Text>
      <Text style={styles.zoneStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerSafe: { backgroundColor: "rgba(255,248,247,0.92)" },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.container,
    paddingTop: Spacing.md,
    gap: 12,
  },
  flex: { flex: 1 },
  title: { fontSize: 24, fontWeight: "700", color: Colors.primary },
  subtitle: { fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 2 },
  toggle: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.pill,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    width: 40,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleBtnActive: { backgroundColor: Colors.primaryContainer },
  scroll: { paddingHorizontal: Spacing.container, paddingTop: 16, paddingBottom: 120 },
  mapCanvas: {
    height: 340,
    borderRadius: Radius.xl,
    overflow: "hidden",
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 4,
    borderColor: Colors.white,
    marginBottom: 16,
  },
  legend: {
    position: "absolute",
    left: 12,
    bottom: 12,
    backgroundColor: "rgba(255,248,247,0.92)",
    borderRadius: Radius.card,
    padding: 12,
    gap: 6,
  },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 12, color: Colors.onSurface, fontWeight: "600" },
  zoneCard: { gap: 16 },
  zoneHead: { flexDirection: "row", alignItems: "center", gap: 12 },
  zoneBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  zoneName: { fontSize: 18, fontWeight: "700", color: Colors.onSurface },
  zoneLevel: { fontSize: 13, color: Colors.onSurfaceVariant },
  zoneStats: { flexDirection: "row", gap: 10 },
  zoneStat: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.card,
    paddingVertical: 12,
  },
  zoneStatValue: { fontSize: 18, fontWeight: "700", color: Colors.primary },
  zoneStatLabel: { fontSize: 11, color: Colors.onSurfaceVariant, fontWeight: "600" },
  list: { gap: 12 },
  listCard: { flexDirection: "row", alignItems: "center", gap: 14 },
  rankNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  rankNumText: { fontSize: 15, fontWeight: "700", color: Colors.onPrimary },
  listArea: { fontSize: 16, fontWeight: "700", color: Colors.onSurface },
  listMeta: { fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 2 },
  levelPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.pill },
  levelPillText: { fontSize: 11, fontWeight: "700" },
});
