import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Badge, GlassCard, ScreenHeader } from "@components/index";
import { Colors, Radius, Spacing } from "@constants/index";
import { useAdminStore } from "@store/useAdminStore";
import { DisputeCase } from "@/types/food";

type IoniconName = keyof typeof Ionicons.glyphMap;
type Outcome = "resolved" | "reverted" | "warned";

const SEVERITY_META: Record<DisputeCase["severity"], { label: string; tone: "error" | "warning" | "neutral" }> = {
  high: { label: "High", tone: "error" },
  medium: { label: "Medium", tone: "warning" },
  low: { label: "Low", tone: "neutral" },
};

const OUTCOMES: { key: Outcome; label: string; icon: IoniconName }[] = [
  { key: "resolved", label: "Resolved", icon: "checkmark-circle" },
  { key: "reverted", label: "Points reverted", icon: "arrow-undo" },
  { key: "warned", label: "User warned", icon: "alert" },
];

export default function DisputesScreen() {
  const cases = useAdminStore((s) => s.disputes);
  const resolveDispute = useAdminStore((s) => s.resolveDispute);
  const [expanded, setExpanded] = useState<string | null>(cases[0]?.id ?? null);
  const [outcomes, setOutcomes] = useState<Record<string, Outcome>>({});

  const resolve = (id: string, outcome: Outcome) => {
    const label = OUTCOMES.find((o) => o.key === outcome)?.label ?? "Resolved";
    setOutcomes((o) => ({ ...o, [id]: outcome }));
    resolveDispute(id, label);
  };

  const open = cases.filter((c) => c.status === "open").length;

  return (
    <View style={styles.root}>
      <ScreenHeader title="Dispute Resolution" subtitle={`${open} open case${open === 1 ? "" : "s"}`} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {cases.map((c) => {
          const sev = SEVERITY_META[c.severity];
          const isOpen = expanded === c.id;
          const resolvedOutcome = outcomes[c.id];
          return (
            <GlassCard key={c.id} style={styles.card}>
              <Pressable
                onPress={() => setExpanded(isOpen ? null : c.id)}
                style={styles.cardHead}
              >
                <View style={[styles.sevDot, sevColor(c.severity)]} />
                <View style={styles.flex}>
                  <Text style={styles.title}>{c.title}</Text>
                  <Text style={styles.ref}>{c.donationRef}</Text>
                </View>
                {c.status === "resolved" ? (
                  <Badge label="Resolved" tone="sage" icon="checkmark" />
                ) : (
                  <Badge label={sev.label} tone={sev.tone} />
                )}
              </Pressable>

              {isOpen && (
                <View style={styles.details}>
                  <Text style={styles.reason}>{c.reason}</Text>

                  {/* Notes thread */}
                  <View style={styles.thread}>
                    <View style={styles.note}>
                      <View style={styles.noteAvatar}>
                        <Ionicons name="person" size={13} color={Colors.secondary} />
                      </View>
                      <View style={styles.noteBubble}>
                        <Text style={styles.noteAuthor}>{c.reporter} • {c.agoLabel}</Text>
                        <Text style={styles.noteText}>{c.reason}</Text>
                      </View>
                    </View>
                    {resolvedOutcome && (
                      <View style={styles.note}>
                        <View style={[styles.noteAvatar, styles.noteAvatarAdmin]}>
                          <Ionicons name="shield-checkmark" size={13} color={Colors.onPrimary} />
                        </View>
                        <View style={[styles.noteBubble, styles.noteBubbleAdmin]}>
                          <Text style={styles.noteAuthorAdmin}>Admin • just now</Text>
                          <Text style={styles.noteTextAdmin}>
                            Case closed as “{OUTCOMES.find((o) => o.key === resolvedOutcome)?.label}”.
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>

                  {c.status === "open" ? (
                    <View style={styles.outcomeRow}>
                      {OUTCOMES.map((o) => (
                        <Pressable
                          key={o.key}
                          onPress={() => resolve(c.id, o.key)}
                          style={({ pressed }) => [styles.outcomeBtn, pressed && styles.pressed]}
                        >
                          <Ionicons name={o.icon} size={16} color={Colors.secondary} />
                          <Text style={styles.outcomeText}>{o.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.resolvedNote}>
                      <Ionicons name="checkmark-done" size={16} color={Colors.secondary} />
                      <Text style={styles.resolvedText}>
                        Closed as “{OUTCOMES.find((o) => o.key === resolvedOutcome)?.label ?? "Resolved"}”
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </GlassCard>
          );
        })}
      </ScrollView>
    </View>
  );
}

function sevColor(sev: DisputeCase["severity"]) {
  if (sev === "high") return { backgroundColor: Colors.error };
  if (sev === "medium") return { backgroundColor: Colors.warning };
  return { backgroundColor: Colors.outline };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.container, paddingTop: 16, paddingBottom: 40, gap: 14 },
  card: { gap: 0, padding: 0, overflow: "hidden" },
  cardHead: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  sevDot: { width: 12, height: 12, borderRadius: 6 },
  flex: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700", color: Colors.onSurface },
  ref: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  details: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant + "33",
    paddingTop: 14,
  },
  reason: { fontSize: 14, color: Colors.onSurface, lineHeight: 20 },
  thread: { gap: 12 },
  note: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  noteAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.secondaryContainer + "66",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  noteAvatarAdmin: { backgroundColor: Colors.primary },
  noteBubble: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.card,
    padding: 12,
    gap: 4,
  },
  noteBubbleAdmin: { backgroundColor: Colors.primaryContainer },
  noteAuthor: { fontSize: 11, fontWeight: "700", color: Colors.onSurfaceVariant },
  noteAuthorAdmin: { fontSize: 11, fontWeight: "700", color: Colors.onPrimary + "cc" },
  noteText: { fontSize: 13, color: Colors.onSurface, lineHeight: 18 },
  noteTextAdmin: { fontSize: 13, color: Colors.onPrimary, lineHeight: 18 },
  outcomeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  outcomeBtn: {
    flexGrow: 1,
    flexBasis: "30%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 42,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
  },
  outcomeText: { fontSize: 12, fontWeight: "700", color: Colors.secondary },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  resolvedNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.secondaryContainer + "44",
    borderRadius: Radius.card,
    padding: 12,
  },
  resolvedText: { fontSize: 13, fontWeight: "700", color: Colors.secondary },
});
