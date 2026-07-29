import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard, ScreenHeader } from "@components/index";
import { Colors, Config, Radius, Spacing } from "@constants/index";
import { useUserStore } from "@store/useUserStore";

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function SettingsScreen() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const setLanguage = useUserStore((s) => s.setLanguage);
  const logout = useUserStore((s) => s.logout);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const cycleLanguage = () => {
    const langs = Config.LANGUAGES;
    const idx = langs.indexOf(user.language);
    setLanguage(langs[(idx + 1) % langs.length]);
  };

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="Settings" subtitle="Preferences & account" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.group}>NOTIFICATIONS</Text>
        <GlassCard style={styles.card} padded={false}>
          <ToggleRow
            icon="notifications-outline"
            title="Push notifications"
            desc="Pickups, approvals and reminders"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
          <Divider />
          <ToggleRow
            icon="mail-outline"
            title="Email updates"
            desc="Weekly impact summary"
            value={emailEnabled}
            onValueChange={setEmailEnabled}
          />
          <Divider />
          <ToggleRow
            icon="location-outline"
            title="Location services"
            desc="Find nearby needs and surplus"
            value={locationEnabled}
            onValueChange={setLocationEnabled}
          />
        </GlassCard>

        <Text style={styles.group}>PREFERENCES</Text>
        <GlassCard style={styles.card} padded={false}>
          <LinkRow
            icon="language-outline"
            title="Language"
            trailing={user.language}
            onPress={cycleLanguage}
          />
          <Divider />
          <LinkRow icon="shield-checkmark-outline" title="Privacy & security" onPress={() => {}} />
          <Divider />
          <LinkRow icon="card-outline" title="Payment & receipts" onPress={() => {}} />
        </GlassCard>

        <Text style={styles.group}>SUPPORT</Text>
        <GlassCard style={styles.card} padded={false}>
          <LinkRow icon="help-circle-outline" title="Help centre" onPress={() => {}} />
          <Divider />
          <LinkRow icon="chatbubble-ellipses-outline" title="Contact us" onPress={() => {}} />
          <Divider />
          <LinkRow icon="information-circle-outline" title="About KindPlate" trailing={`v${Config.APP_VERSION.split(" ")[0]}`} onPress={() => {}} />
        </GlassCard>

        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
        <Text style={styles.version}>KindPlate {Config.APP_VERSION}</Text>
      </ScrollView>
    </View>
  );
}

function ToggleRow({
  icon,
  title,
  desc,
  value,
  onValueChange,
}: {
  icon: IoniconName;
  title: string;
  desc: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color={Colors.secondary} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.outlineVariant, true: Colors.secondary }}
        thumbColor={Colors.white}
      />
    </View>
  );
}

function LinkRow({
  icon,
  title,
  trailing,
  onPress,
}: {
  icon: IoniconName;
  title: string;
  trailing?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color={Colors.secondary} />
      </View>
      <Text style={[styles.rowTitle, styles.flex]}>{title}</Text>
      {trailing && <Text style={styles.trailing}>{trailing}</Text>}
      <Ionicons name="chevron-forward" size={18} color={Colors.onSurfaceVariant} />
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.container, paddingBottom: 40 },
  group: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
    marginBottom: 10,
    marginLeft: 4,
    marginTop: 8,
  },
  card: { marginBottom: 20, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryContainer + "66",
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: "600", color: Colors.onSurface },
  rowDesc: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  trailing: { fontSize: 13, fontWeight: "600", color: Colors.secondary, marginRight: 6 },
  divider: { height: 1, backgroundColor: Colors.outlineVariant + "44", marginLeft: 70 },
  pressed: { opacity: 0.7 },
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 54,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.error + "33",
    marginTop: 4,
  },
  signOutText: { fontSize: 16, fontWeight: "700", color: Colors.error },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    opacity: 0.7,
    marginTop: 16,
  },
});
