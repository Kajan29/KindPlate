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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError(undefined);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 700);
  };

  return (
    <AuthBackdrop
      image={AppImages.elderChild}
      kicker="ACCOUNT HELP"
      title="Reset password"
      subtitle="We'll email you a secure link to set a new password."
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
            {sent ? (
              <View style={styles.success}>
                <View style={styles.successIcon}>
                  <Ionicons name="mail-open-outline" size={34} color={Colors.secondary} />
                </View>
                <Text style={styles.successTitle}>Check your inbox</Text>
                <Text style={styles.successDesc}>
                  If an account exists for {email}, a reset link is on its way. It may take a few
                  minutes to arrive.
                </Text>
                <AppButton
                  label="Back to Sign In"
                  icon="arrow-back"
                  onPress={() => router.replace("/login")}
                />
              </View>
            ) : (
              <>
                <AuthField
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  icon="mail-outline"
                  keyboardType="email-address"
                  error={error}
                />
                <AppButton
                  label="Send reset link"
                  icon="send"
                  loading={submitting}
                  onPress={handleSend}
                />
                <View style={styles.trustRow}>
                  <Ionicons name="shield-checkmark" size={16} color={Colors.secondary} />
                  <Text style={styles.trustText}>Links expire after 30 minutes for your security.</Text>
                </View>

                <Pressable
                  onPress={() => router.replace("/login")}
                  style={styles.backRow}
                  hitSlop={8}
                >
                  <Ionicons name="chevron-back" size={16} color={Colors.primary} />
                  <Text style={styles.backLink}>Back to Sign In</Text>
                </Pressable>
              </>
            )}
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
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  trustText: { fontSize: 12, color: Colors.onSurfaceVariant },
  success: { alignItems: "center", gap: 12 },
  successIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.secondaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: { fontSize: 20, fontWeight: "700", color: Colors.primary },
  successDesc: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 2,
  },
  backLink: { fontSize: 14, fontWeight: "700", color: Colors.primary },
});
