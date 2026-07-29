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
import { AppImages, Colors, Radius, Spacing } from "@constants/index";
import { useUserStore } from "@store/useUserStore";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const router = useRouter();
  const register = useUserStore((s) => s.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Please enter your name";
    if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address";
    if (password.length < 6) next.password = "At least 6 characters";
    if (confirm !== password) next.confirm = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length > 0 || !agree) return;

    setSubmitting(true);
    setTimeout(() => {
      register({ name, email });
      router.replace("/(tabs)");
    }, 700);
  };

  return (
    <AuthBackdrop
      image={AppImages.communityMeal}
      kicker="JOIN KINDPLATE"
      title="Create your account"
      subtitle="Join the movement turning surplus into sustenance."
      onBack={() => router.back()}
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
              label="Full name"
              value={name}
              onChangeText={setName}
              placeholder="e.g., Kajan Ratnam"
              icon="person-outline"
              autoCapitalize="words"
              error={errors.name}
            />
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
              placeholder="Create a password"
              icon="lock-closed-outline"
              secure
              error={errors.password}
            />
            <AuthField
              label="Confirm password"
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Re-enter your password"
              icon="lock-closed-outline"
              secure
              error={errors.confirm}
            />

            {/* Terms */}
            <Pressable style={styles.terms} onPress={() => setAgree((a) => !a)}>
              <View style={[styles.checkbox, agree && styles.checkboxOn]}>
                {agree && <Ionicons name="checkmark" size={14} color={Colors.white} />}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>
            </Pressable>

            <AppButton
              label="Create Account"
              icon="checkmark-circle-outline"
              loading={submitting}
              disabled={!agree}
              onPress={handleRegister}
            />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <Pressable onPress={() => router.replace("/login")} hitSlop={8}>
                <Text style={styles.loginLink}>Sign In</Text>
              </Pressable>
            </View>
          </View>

          <SafeAreaView edges={["bottom"]} />
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
  terms: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.outline,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  termsText: { flex: 1, fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 18 },
  termsLink: { color: Colors.secondary, fontWeight: "700" },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant + "55",
  },
  loginText: { fontSize: 14, color: Colors.onSurfaceVariant },
  loginLink: { fontSize: 14, fontWeight: "700", color: Colors.primary },
});
