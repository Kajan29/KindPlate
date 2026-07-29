import { Ionicons } from "@expo/vector-icons";
import { StyleProp, ViewStyle } from "react-native";

// Type declaration for the platform-specific LiveMap component.
// Metro resolves the real implementation from LiveMap.native.tsx (Android/iOS)
// or LiveMap.web.tsx (web); TypeScript uses this shared signature.
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

export interface LiveMapProps {
  markers: LiveMapMarker[];
  activeId: string;
  onSelect: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

export default function LiveMap(props: LiveMapProps): JSX.Element;
