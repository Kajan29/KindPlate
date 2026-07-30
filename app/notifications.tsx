import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard, ScreenBackground, ScreenHeader } from "@components/index";
import { Colors, Radius, Spacing, maxContentWidth } from "@constants/index";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface NotificationItem {
  id: string;
  icon: IoniconName;
  tone: "sage" | "maroon" | "warning";
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    icon: "bicycle",
    tone: "sage",
    title: "Rider assigned",
    body: "Ravi is on the way to collect your ‘15 Lunch Packets’ donation.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "n2",
    icon: "checkmark-circle",
    tone: "sage",
    title: "Donation approved",
    body: "Your ‘Assorted Local Fruit Basket’ was approved by Nallur NGO.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n3",
    icon: "alert-circle",
    tone: "warning",
    title: "Expiring soon",
    body: "‘Evening Snacks — 20 Pax’ expires in under 2 hours.",
    time: "3h ago",
    unread: false,
  },
  {
    id: "n4",
    icon: "heart",
    tone: "maroon",
    title: "You reached Top 5%",
    body: "You're now among Jaffna's top donors this month. Thank you!",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n5",
    icon: "people",
    tone: "sage",
    title: "Community milestone",
    body: "KindPlate rescued 12,482 meals this month across the region.",
    time: "2 days ago",
    unread: false,
  },
];

const TONES = {
  sage: { bg: Colors.secondaryContainer, fg: Colors.onSecondaryContainer },
  maroon: { bg: Colors.primaryContainer, fg: Colors.onPrimary },
  warning: { bg: "rgba(249,212,90,0.3)", fg: "#8a6d00" },
};

export default function NotificationsScreen() {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <ScreenBackground>
      <ScreenHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : "You're all caught up"}
        right={
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread}</Text>
          </View>
        }
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((n) => {
          const tone = TONES[n.tone];
          return (
            <GlassCard key={n.id} style={[styles.card, n.unread && styles.unreadCard]}>
              <View style={styles.row}>
                <View style={[styles.icon, { backgroundColor: tone.bg }]}>
                  <Ionicons name={n.icon} size={20} color={tone.fg} />
                </View>
                <View style={styles.flex}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{n.title}</Text>
                    {n.unread && <View style={styles.dot} />}
                  </View>
                  <Text style={styles.body}>{n.body}</Text>
                  <Text style={styles.time}>{n.time}</Text>
                </View>
              </View>
            </GlassCard>
          );
        })}
        <Text style={styles.end}>That's everything for now.</Text>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    width: "100%",
    maxWidth: maxContentWidth,
    alignSelf: "center",
    padding: Spacing.container,
    paddingBottom: 40,
    gap: 12,
  },
  badge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: { color: Colors.white, fontSize: 12, fontWeight: "700" },
  card: { padding: 14 },
  unreadCard: { borderColor: Colors.secondary + "66" },
  row: { flexDirection: "row", gap: 14 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1, gap: 3 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 15, fontWeight: "700", color: Colors.onSurface, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error },
  body: { fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 },
  time: { fontSize: 11, color: Colors.onSurfaceVariant, opacity: 0.7, marginTop: 2 },
  end: { textAlign: "center", fontSize: 13, color: Colors.onSurfaceVariant, opacity: 0.6, marginTop: 8 },
});
