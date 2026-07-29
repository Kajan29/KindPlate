import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppButton, Badge, GlassCard } from "@components/index";
import LiveMap, { type LiveMapMarker } from "@components/LiveMap";
import { Colors, Radius } from "@constants/index";
import { mapPins } from "@data/index";

const URGENCY_TONE = {
  critical: { label: "Critical Need", tone: "error" as const },
  high: { label: "High Priority", tone: "warning" as const },
  normal: { label: "Surplus Available", tone: "sage" as const },
};

export default function MapScreen() {
  const [selectedId, setSelectedId] = useState(mapPins[0].id);
  const [filter, setFilter] = useState<"all" | "need" | "surplus">("all");
  const [query, setQuery] = useState("");

  const selected = mapPins.find((p) => p.id === selectedId) ?? mapPins[0];
  const visiblePins =
    filter === "all" ? mapPins : mapPins.filter((p) => p.type === filter);

  const needCount = mapPins.filter((p) => p.type === "need").length;
  const surplusCount = mapPins.filter((p) => p.type === "surplus").length;
  const urgency = URGENCY_TONE[selected.urgency];
  const isSurplus = selected.type === "surplus";

  const markers: LiveMapMarker[] = visiblePins.map((pin) => ({
    id: pin.id,
    latitude: pin.latitude,
    longitude: pin.longitude,
    color: pin.type === "surplus" ? Colors.secondary : Colors.primary,
    icon: pin.type === "surplus" ? "gift" : "restaurant",
    title: pin.title,
    description: pin.actionText,
    emphasize: pin.urgency === "critical",
  }));

  return (
    <View style={styles.root}>
      {/* Map */}
      <LiveMap markers={markers} activeId={selectedId} onSelect={setSelectedId} />

      {/* Search + filters overlay */}
      <SafeAreaView edges={["top"]} style={styles.topOverlay} pointerEvents="box-none">
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.onSurfaceVariant} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search Jaffna neighbourhoods..."
            placeholderTextColor={Colors.onSurfaceVariant + "99"}
            style={styles.searchInput}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <FilterChip
            label={`Need (${needCount})`}
            icon="trending-down"
            tone="maroon"
            active={filter === "need"}
            onPress={() => setFilter(filter === "need" ? "all" : "need")}
          />
          <FilterChip
            label={`Surplus (${surplusCount})`}
            icon="trending-up"
            tone="teal"
            active={filter === "surplus"}
            onPress={() => setFilter(filter === "surplus" ? "all" : "surplus")}
          />
          <FilterChip
            label="All"
            icon="filter"
            tone="neutral"
            active={filter === "all"}
            onPress={() => setFilter("all")}
          />
        </ScrollView>
      </SafeAreaView>

      {/* Floating detail card */}
      <SafeAreaView edges={["bottom"]} style={styles.bottomOverlay} pointerEvents="box-none">
        <GlassCard style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View style={styles.flex}>
              <Badge label={urgency.label} tone={urgency.tone} />
              <Text style={styles.detailTitle}>{selected.title}</Text>
              <Text style={styles.detailSubtitle}>{selected.subtitle}</Text>
            </View>
            <Pressable style={styles.shareBtn} accessibilityLabel="Share">
              <Ionicons name="share-social-outline" size={20} color={Colors.primary} />
            </Pressable>
          </View>

          <View
            style={[
              styles.actionBox,
              isSurplus ? styles.actionBoxSurplus : styles.actionBoxNeed,
            ]}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: (isSurplus ? Colors.secondary : Colors.primary) + "1A" },
              ]}
            >
              <Ionicons
                name={isSurplus ? "gift" : "nutrition"}
                size={20}
                color={isSurplus ? Colors.secondary : Colors.primary}
              />
            </View>
            <View style={styles.flex}>
              <Text
                style={[
                  styles.actionText,
                  { color: isSurplus ? Colors.secondary : Colors.primary },
                ]}
              >
                {selected.actionText}
              </Text>
              <Text style={styles.actionDesc}>{selected.description}</Text>
            </View>
          </View>

          <View style={styles.detailActions}>
            <AppButton
              label={isSurplus ? "Reserve" : "Commit to Donate"}
              variant={isSurplus ? "secondary" : "primary"}
              style={styles.detailBtn}
            />
            <AppButton label="Directions" variant="outline" style={styles.detailBtn} />
          </View>
        </GlassCard>
      </SafeAreaView>
    </View>
  );
}

function FilterChip({
  label,
  icon,
  tone,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone: "maroon" | "teal" | "neutral";
  active: boolean;
  onPress: () => void;
}) {
  const bg =
    tone === "maroon" ? Colors.primary : tone === "teal" ? Colors.secondary : "rgba(255,248,247,0.95)";
  const fg = tone === "neutral" ? Colors.onSurfaceVariant : Colors.white;
  return (
    <Pressable
      onPress={onPress}
      style={[styles.filterChip, { backgroundColor: bg }, !active && styles.filterChipInactive]}
    >
      <Ionicons name={icon} size={16} color={fg} />
      <Text style={[styles.filterText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceContainerHigh },
  topOverlay: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 52,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,248,247,0.95)",
    paddingHorizontal: 18,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.onSurface,
  },
  chips: {
    gap: 8,
    paddingRight: 20,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: Radius.pill,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  filterChipInactive: { opacity: 0.55 },
  filterText: { fontSize: 13, fontWeight: "700" },
  bottomOverlay: {
    marginTop: "auto",
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  detailCard: {
    padding: 20,
    gap: 16,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  flex: { flex: 1, gap: 4 },
  detailTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginTop: 4,
  },
  detailSubtitle: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: Radius.card,
    borderWidth: 1,
  },
  actionBoxNeed: {
    backgroundColor: Colors.primaryContainer + "12",
    borderColor: Colors.primaryContainer + "30",
  },
  actionBoxSurplus: {
    backgroundColor: Colors.secondaryContainer + "40",
    borderColor: Colors.secondary + "40",
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "700",
  },
  actionDesc: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  detailActions: {
    flexDirection: "row",
    gap: 12,
  },
  detailBtn: {
    flex: 1,
    height: 50,
  },
});
