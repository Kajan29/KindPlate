import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet } from "react-native";
import { Colors, fontScale, moderateScale } from "@constants/index";

const TAB_ICON = moderateScale(26);

/**
 * Admin bottom navigation, per the admin design spec:
 * Dashboard | Review Queue | Map/Demand | Points | Profile/Settings.
 */
export default function AdminTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "grid" : "grid-outline"} size={TAB_ICON} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: "Review",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "clipboard" : "clipboard-outline"}
              size={TAB_ICON}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="demand"
        options={{
          title: "Demand",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "flame" : "flame-outline"} size={TAB_ICON} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="points"
        options={{
          title: "Points",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "trophy" : "trophy-outline"} size={TAB_ICON} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={TAB_ICON} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: "rgba(255,248,247,0.96)",
    borderTopWidth: 0,
    height: Platform.OS === "ios" ? moderateScale(84) : moderateScale(70),
    paddingTop: moderateScale(8),
    paddingBottom: Platform.OS === "ios" ? moderateScale(26) : moderateScale(12),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  label: {
    fontSize: fontScale(11),
    fontWeight: "600",
  },
  item: {
    paddingTop: 2,
  },
});
