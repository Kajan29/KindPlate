import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius } from "@constants/index";

export interface LiveMapMarker {
  id: string;
  latitude: number;
  longitude: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  title?: string;
  description?: string;
  emphasize?: boolean;
}

interface LiveMapProps {
  markers: LiveMapMarker[];
  activeId: string;
  onSelect: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Web fallback: react-native-maps (Google Maps native SDK) does not run on web,
 * so we render an interactive list of markers instead. Selecting one still drives
 * the surrounding UI, matching the native map behavior.
 */
export default function LiveMap({ markers, activeId, onSelect, style }: LiveMapProps) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.fill, style]}>
      <View style={styles.notice}>
        <Ionicons name="map-outline" size={16} color={Colors.onSurfaceVariant} />
        <Text style={styles.noticeText}>Interactive map available on the mobile app</Text>
      </View>
      <View style={styles.pins}>
        {markers.map((m) => {
          const isActive = m.id === activeId;
          return (
            <Pressable
              key={m.id}
              onPress={() => onSelect(m.id)}
              style={[
                styles.pinRow,
                { borderColor: m.color },
                isActive && { backgroundColor: Colors.primaryContainer },
              ]}
            >
              <View style={[styles.pinDot, { backgroundColor: m.color }]}>
                <Ionicons name={m.icon} size={13} color={Colors.white} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.pinLabel}>{m.title ?? m.id}</Text>
                {m.description ? <Text style={styles.pinMeta}>{m.description}</Text> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { padding: 16, justifyContent: "center", gap: 12 },
  flex: { flex: 1 },
  notice: { flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center" },
  noticeText: { fontSize: 13, color: Colors.onSurfaceVariant, fontWeight: "600" },
  pins: { gap: 10 },
  pinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  pinDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  pinLabel: { fontSize: 15, fontWeight: "700", color: Colors.onSurface },
  pinMeta: { fontSize: 12, color: Colors.onSurfaceVariant, fontWeight: "600", marginTop: 2 },
});
