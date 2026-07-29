import { useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from "react-native-maps";
import { Colors } from "@constants/index";

export interface LiveMapMarker {
  id: string;
  latitude: number;
  longitude: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  title?: string;
  description?: string;
  /** Draw a larger surrounding halo (e.g. for high-priority markers). */
  emphasize?: boolean;
}

interface LiveMapProps {
  markers: LiveMapMarker[];
  activeId: string;
  onSelect: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

/** Region that comfortably frames all the markers. */
function computeRegion(markers: LiveMapMarker[]): Region {
  if (markers.length === 0) {
    return { latitude: 9.6738, longitude: 80.0245, latitudeDelta: 0.08, longitudeDelta: 0.08 };
  }
  const lats = markers.map((m) => m.latitude);
  const lngs = markers.map((m) => m.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.6, 0.02),
    longitudeDelta: Math.max((maxLng - minLng) * 1.6, 0.02),
  };
}

export default function LiveMap({ markers, activeId, onSelect, style }: LiveMapProps) {
  const initialRegion = useMemo(() => computeRegion(markers), [markers]);

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={[StyleSheet.absoluteFill, style]}
      initialRegion={initialRegion}
      showsPointsOfInterest={false}
      toolbarEnabled={false}
    >
      {markers.map((m) => {
        const isActive = m.id === activeId;
        return (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.title}
            description={m.description}
            onPress={() => onSelect(m.id)}
            tracksViewChanges={false}
          >
            <View style={styles.markerWrap}>
              <View
                style={[
                  styles.markerHalo,
                  { backgroundColor: m.color + "33" },
                  m.emphasize && styles.markerHaloLarge,
                ]}
              />
              <View
                style={[
                  styles.markerPin,
                  { borderColor: m.color },
                  isActive && { backgroundColor: m.color },
                ]}
              >
                <Ionicons name={m.icon} size={15} color={isActive ? Colors.white : m.color} />
              </View>
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  markerWrap: { alignItems: "center", justifyContent: "center", width: 110, height: 110 },
  markerHalo: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  markerHaloLarge: { width: 96, height: 96, borderRadius: 48 },
  markerPin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
});
