import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppButton, AuthBackdrop, AuthField } from "@components/index";
import { AppImages, Colors, Config, DemoAccounts, Radius, Spacing } from "@constants/index";
import type { DemoAccountKind } from "@constants/index";
import { useUserStore } from "@store/useUserStore";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const login = useUserStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = () => {
    const next: typeof errors = {};
    if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Single login for everyone — an admin signs in through this same form.
    // We detect the app-owner account by its email and route to the admin area.
    const isAdmin = /^admin(@|\+|\.)/i.test(email.trim()) ||
      email.trim().toLowerCase() === "admin@kindplate.org";

    setSubmitting(true);
    setTimeout(() => {
      login(isAdmin);
      router.replace(isAdmin ? "/(admin)" : "/(tabs)");
    }, 600);
  };

  // One-tap demo sign-in: fills the credentials, then routes to the right area.
  const handleDemo = (kind: DemoAccountKind) => {
    const account = DemoAccounts[kind];
    const isAdmin = kind === "admin";
    setEmail(account.email);
    setPassword(account.password);
    setErrors({});
    setSubmitting(true);
    setTimeout(() => {
      login(isAdmin);
      router.replace(isAdmin ? "/(admin)" : "/(tabs)");
    }, 600);
  };

  return (
    <AuthBackdrop
      image={AppImages.heroParcel}
      kicker="WELCOME BACK"
      title="Sign in to KindPlate"
      subtitle="Continue sharing kindness across Jaffna, one meal at a time."
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <AuthField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              icon="mail-outline"
              keyboardType="email-address"
              error={errors.email}
            />
            <AuthField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              icon="lock-closed-outline"
              secure
              error={errors.password}
            />

            <Pressable
              onPress={() => router.push("/forgot-password")}
              style={styles.forgotWrap}
              hitSlop={8}
            >
              <Text style={styles.forgot}>Forgot password?</Text>
            </Pressable>

            <AppButton
              label="Sign In"
              icon="log-in-outline"
              loading={submitting}
              onPress={handleLogin}
            />

            <View style={styles.trustRow}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.secondary} />
              <Text style={styles.trustText}>Your data is encrypted and kept private.</Text>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or try a demo</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.demoRow}>
              <Pressable
                onPress={() => handleDemo("user")}
                disabled={submitting}
                accessibilityRole="button"
                style={({ pressed }) => [styles.demoBtn, pressed && styles.demoPressed]}
              >
                <Ionicons name="person-outline" size={18} color={Colors.secondary} />
                <Text style={styles.demoBtnText}>Demo User</Text>
              </Pressable>
              <Pressable
                onPress={() => handleDemo("admin")}
                disabled={submitting}
                accessibilityRole="button"
                style={({ pressed }) => [styles.demoBtn, styles.demoBtnAdmin, pressed && styles.demoPressed]}
              >
                <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} />
                <Text style={[styles.demoBtnText, styles.demoBtnTextAdmin]}>Demo Admin</Text>
              </Pressable>
            </View>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>New to KindPlate?</Text>
              <Pressable onPress={() => router.push("/register")} hitSlop={8}>
                <Text style={styles.registerLink}>Create an account</Text>
              </Pressable>
            </View>
          </View>

          <SafeAreaView edges={["bottom"]}>
            <Text style={styles.footer}>Empowering the community of {Config.REGION}</Text>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackdrop>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: Spacing.container,
    paddingTop: 24,
    paddingBottom: 12,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.xl,
    padding: 22,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 14,
  },
  forgotWrap: { alignSelf: "flex-end", marginTop: -6 },
  forgot: { fontSize: 13, fontWeight: "700", color: Colors.secondary },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 2,
  },
  trustText: { fontSize: 12, color: Colors.onSurfaceVariant },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.outlineVariant + "77" },
  dividerText: { fontSize: 12, fontWeight: "600", color: Colors.onSurfaceVariant },
  demoRow: { flexDirection: "row", gap: 12 },
  demoBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 48,
    borderRadius: Radius.button,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
  },
  demoBtnAdmin: { borderColor: Colors.primary },
  demoPressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  demoBtnText: { fontSize: 14, fontWeight: "700", color: Colors.secondary },
  demoBtnTextAdmin: { color: Colors.primary },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant + "55",
  },
  registerText: { fontSize: 14, color: Colors.onSurfaceVariant },
  registerLink: { fontSize: 14, fontWeight: "700", color: Colors.primary },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginTop: 16,
  },
});
