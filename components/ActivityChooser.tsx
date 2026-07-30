import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "./TopBar";
import { ScreenBackground } from "./ScreenBackground";
import { Colors, Radius, Spacing, maxContentWidth } from "@constants/index";
import { useUserStore } from "@store/useUserStore";
import { UserRole } from "@/types/food";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface Activity {
  key: "donor" | "volunteer" | "recipient";
  title: string;
  description: string;
  icon: IoniconName;
  tint: string;
  tintBg: string;
}

const ACTIVITIES: Activity[] = [
  {
    key: "donor",
    title: "Donate Food",
    description: "Share surplus cooked meals, groceries or produce with those in need.",
    icon: "gift",
    tint: Colors.onPrimary,
    tintBg: Colors.primaryContainer,
  },
  {
    key: "volunteer",
    title: "Volunteer",
    description: "Help collect and deliver donations, as an individual or an organisation.",
    icon: "bicycle",
    tint: Colors.onSecondaryContainer,
    tintBg: Colors.secondaryContainer,
  },
  {
    key: "recipient",
    title: "Inform a Place",
    description: "Report a family, home or community spot that needs food support.",
    icon: "megaphone",
    tint: Colors.onTertiaryContainer,
    tintBg: "rgba(106,153,123,0.22)",
  },
];

/**
 * Shown on the Home tab for a freshly registered "normal user" who has not yet
 * picked what they want to do. Donate / Volunteer / Inform a Place map to the
 * donor, volunteer/ngo and recipient experiences respectively. Choosing to
 * volunteer asks whether they are an NGO/committee or an individual.
 */
export function ActivityChooser() {
  const user = useUserStore((s) => s.user);
  const chooseActivity = useUserStore((s) => s.chooseActivity);
  const [volunteerOpen, setVolunteerOpen] = useState(false);

  const firstName = user.name.split(" ")[0];

  const pick = (activity: Activity) => {
    if (activity.key === "volunteer") {
      setVolunteerOpen(true);
      return;
    }
    chooseActivity(activity.key);
  };

  const pickVolunteerType = (role: UserRole) => {
    setVolunteerOpen(false);
    chooseActivity(role);
  };

  return (
    <ScreenBackground>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TopBar avatarUrl={user.avatarUrl} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.hello}>Hi {firstName} 👋</Text>
        <Text style={styles.title}>How would you like to help today?</Text>
        <Text style={styles.subtitle}>
          Pick an activity to get started. You can switch anytime from your profile.
        </Text>

        <View style={styles.cards}>
          {ACTIVITIES.map((a) => (
            <Pressable
              key={a.key}
              onPress={() => pick(a)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <View style={[styles.cardIcon, { backgroundColor: a.tintBg }]}>
                <Ionicons name={a.icon} size={26} color={a.tint} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{a.title}</Text>
                <Text style={styles.cardDesc}>{a.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={Colors.onSurfaceVariant} />
            </Pressable>
          ))}
        </View>

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.secondary} />
          <Text style={styles.noteText}>
            Every role shares one account — your choice just tailors your dashboard.
          </Text>
        </View>
      </ScrollView>

      {/* Volunteer sub-choice: NGO / committee or individual */}
      <Modal
        visible={volunteerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setVolunteerOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setVolunteerOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>How are you volunteering?</Text>
            <Text style={styles.sheetSubtitle}>
              Are you signing up on behalf of an organisation or on your own?
            </Text>

            <Pressable
              onPress={() => pickVolunteerType("ngo")}
              style={({ pressed }) => [styles.option, pressed && styles.pressed]}
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.secondaryContainer }]}>
                <Ionicons name="business" size={24} color={Colors.onSecondaryContainer} />
              </View>
              <View style={styles.optionBody}>
                <Text style={styles.optionTitle}>NGO / Committee</Text>
                <Text style={styles.optionDesc}>Manage pickups and a team of volunteers.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.onSurfaceVariant} />
            </Pressable>

            <Pressable
              onPress={() => pickVolunteerType("volunteer")}
              style={({ pressed }) => [styles.option, pressed && styles.pressed]}
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.primaryContainer }]}>
                <Ionicons name="person" size={24} color={Colors.onPrimary} />
              </View>
              <View style={styles.optionBody}>
                <Text style={styles.optionTitle}>Individual Volunteer</Text>
                <Text style={styles.optionDesc}>Pick up and deliver donations yourself.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.onSurfaceVariant} />
            </Pressable>

            <Pressable onPress={() => setVolunteerOpen(false)} style={styles.cancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerSafe: { backgroundColor: "rgba(255,248,247,0.82)" },
  scroll: {
    width: "100%",
    maxWidth: maxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.container,
    paddingTop: Spacing.lg,
    paddingBottom: 120,
  },
  hello: { fontSize: 16, fontWeight: "600", color: Colors.secondary },
  title: { fontSize: 26, fontWeight: "700", color: Colors.primary, marginTop: 6 },
  subtitle: { fontSize: 14, color: Colors.onSurfaceVariant, marginTop: 8, lineHeight: 20 },
  cards: { gap: 14, marginTop: 26 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "rgba(255,248,247,0.95)",
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "55",
    padding: 18,
  },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: Colors.onSurface },
  cardDesc: { fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 18 },
  note: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    backgroundColor: Colors.secondaryContainer + "44",
    borderRadius: Radius.card,
    padding: 14,
  },
  noteText: { flex: 1, fontSize: 12, color: Colors.onSurface, lineHeight: 17 },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: 22,
    paddingBottom: 34,
    gap: 12,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.outlineVariant,
    marginBottom: 6,
  },
  sheetTitle: { fontSize: 20, fontWeight: "700", color: Colors.primary },
  sheetSubtitle: { fontSize: 13, color: Colors.onSurfaceVariant, marginBottom: 6 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    borderRadius: Radius.card,
    padding: 14,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  optionBody: { flex: 1, gap: 3 },
  optionTitle: { fontSize: 16, fontWeight: "700", color: Colors.onSurface },
  optionDesc: { fontSize: 12, color: Colors.onSurfaceVariant },
  cancel: { alignSelf: "center", paddingVertical: 12, paddingHorizontal: 24, marginTop: 4 },
  cancelText: { fontSize: 15, fontWeight: "700", color: Colors.onSurfaceVariant },
});
