import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppButton, GlassCard, TopBar } from "@components/index";
import { Colors, Radius, Spacing } from "@constants/index";
import { CATEGORY_META, MockImages } from "@data/index";
import { useDonationStore } from "@store/useDonationStore";
import { useAdminStore } from "@store/useAdminStore";
import { FoodCategory } from "@/types/food";

const CATEGORIES = Object.keys(CATEGORY_META) as FoodCategory[];

const SAFETY_TIPS = [
  "Keep hot food above 60°C and cold food below 5°C before handover.",
  "Use food-grade packaging only (banana leaves, clean containers).",
  "Avoid donating high-risk foods kept at room temperature over 2 hours.",
];

const CATEGORY_IMAGE: Record<FoodCategory, string> = {
  veg: MockImages.lunchPacket,
  non_veg: MockImages.plate,
  dry_goods: MockImages.produce,
  bakery: MockImages.bread,
  produce: MockImages.fruitBasket,
  prepared: MockImages.riceCurry,
};

export default function DonateScreen() {
  const router = useRouter();
  const addDonation = useDonationStore((s) => s.addDonation);
  const ingestDonation = useAdminStore((s) => s.ingestDonation);

  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("packets");
  const [category, setCategory] = useState<FoodCategory>("veg");
  const [expiry, setExpiry] = useState("");
  const [area, setArea] = useState("Nallur");
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(false);

  const canSubmit = title.trim().length > 0 && quantity.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      const donation = addDonation({
        title: title.trim(),
        description: "Shared via KindPlate donor flow.",
        category,
        quantity: Number(quantity) || 1,
        unit,
        expiresInLabel: expiry.trim() ? `Best before ${expiry.trim()}` : "Expires in 04:00:00",
        imageUrl: CATEGORY_IMAGE[category],
        area,
      });
      // Bridge the new donation into the admin review queue.
      ingestDonation(donation);
      setSubmitting(false);
      setPublished(true);
      setTimeout(() => {
        setPublished(false);
        setTitle("");
        setQuantity("");
        setExpiry("");
        router.push("/(tabs)");
      }, 1400);
    }, 900);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TopBar avatarUrl={undefined} showNotificationDot={false} />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Share a Meal</Text>
        <Text style={styles.subtitle}>
          Complete the details below to help someone in Jaffna today. Dignity begins with quality.
        </Text>

        {/* Photo upload */}
        <Pressable style={styles.photo} accessibilityRole="button">
          <ImageBackground
            source={{ uri: CATEGORY_IMAGE[category] }}
            style={styles.photoBg}
            imageStyle={styles.photoImage}
          >
            <View style={styles.photoInner}>
              <Ionicons name="camera" size={40} color={Colors.secondary} />
              <Text style={styles.photoLabel}>UPLOAD FOOD PHOTO</Text>
              <Text style={styles.photoHint}>Clear photos help recipients choose quickly</Text>
            </View>
          </ImageBackground>
        </Pressable>

        {/* Title */}
        <GlassCard style={styles.field}>
          <Text style={styles.fieldLabel}>FOOD TITLE</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., 20x Veg Lunch Packets"
            placeholderTextColor={Colors.onSurfaceVariant + "88"}
            style={styles.input}
          />
          <Text style={styles.fieldHint}>Be specific about quantities and contents.</Text>
        </GlassCard>

        {/* Quantity + unit */}
        <GlassCard style={styles.field}>
          <Text style={styles.fieldLabel}>QUANTITY</Text>
          <View style={styles.qtyRow}>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              placeholder="20"
              placeholderTextColor={Colors.onSurfaceVariant + "88"}
              keyboardType="number-pad"
              style={[styles.input, styles.qtyInput]}
            />
            <View style={styles.unitChips}>
              {["packets", "meals", "kg", "boxes"].map((u) => {
                const active = unit === u;
                return (
                  <Pressable
                    key={u}
                    onPress={() => setUnit(u)}
                    style={[styles.unitChip, active && styles.unitChipActive]}
                  >
                    <Text style={[styles.unitText, active && styles.unitTextActive]}>{u}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </GlassCard>

        {/* Category */}
        <GlassCard style={styles.field}>
          <Text style={styles.fieldLabel}>CATEGORY</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              const active = category === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                >
                  <Ionicons
                    name={meta.icon as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color={active ? Colors.secondary : Colors.onSurfaceVariant}
                  />
                  <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                    {meta.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </GlassCard>

        {/* Expiry */}
        <GlassCard style={styles.field}>
          <Text style={styles.fieldLabel}>EXPIRY TIME / BEST BEFORE</Text>
          <TextInput
            value={expiry}
            onChangeText={setExpiry}
            placeholder="e.g., Today 6:00 PM"
            placeholderTextColor={Colors.onSurfaceVariant + "88"}
            style={styles.input}
          />
          <View style={styles.warnRow}>
            <Ionicons name="warning-outline" size={14} color={Colors.error} />
            <Text style={styles.warnText}>
              Ensure food is safe for consumption for at least 2 hours post-listing.
            </Text>
          </View>
        </GlassCard>

        {/* Pickup area */}
        <GlassCard style={styles.field}>
          <Text style={styles.fieldLabel}>PICKUP AREA</Text>
          <TextInput
            value={area}
            onChangeText={setArea}
            placeholder="e.g., Nallur"
            placeholderTextColor={Colors.onSurfaceVariant + "88"}
            style={styles.input}
          />
        </GlassCard>

        {/* Safety guidelines */}
        <View style={styles.safety}>
          <View style={styles.safetyHeader}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.onSecondaryFixedVariant} />
            <Text style={styles.safetyTitle}>Safety Guidelines</Text>
          </View>
          {SAFETY_TIPS.map((tip) => (
            <View key={tip} style={styles.tipRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <AppButton
          label={published ? "Published!" : "Post Donation"}
          icon={published ? "checkmark-circle" : "send"}
          iconRight={!published}
          loading={submitting}
          disabled={!canSubmit}
          onPress={handleSubmit}
          variant={published ? "secondary" : "primary"}
          style={styles.submit}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerSafe: { backgroundColor: "rgba(255,248,247,0.92)" },
  scroll: {
    paddingHorizontal: Spacing.container,
    paddingTop: Spacing.lg,
    paddingBottom: 140,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: 20,
  },
  photo: {
    height: 200,
    borderRadius: Radius.card,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    borderStyle: "dashed",
    overflow: "hidden",
    marginBottom: 16,
  },
  photoBg: { flex: 1, justifyContent: "center", alignItems: "center" },
  photoImage: { opacity: 0.28 },
  photoInner: { alignItems: "center", gap: 6 },
  photoLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    color: Colors.secondary,
  },
  photoHint: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: Colors.secondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.secondary + "33",
    padding: 12,
    fontSize: 16,
    color: Colors.onSurface,
  },
  fieldHint: {
    fontSize: 11,
    fontStyle: "italic",
    color: Colors.onSurfaceVariant,
    marginTop: 8,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qtyInput: {
    width: 84,
    textAlign: "center",
  },
  unitChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    flex: 1,
  },
  unitChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  unitChipActive: {
    backgroundColor: Colors.secondaryContainer,
    borderColor: Colors.secondary,
  },
  unitText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.onSurfaceVariant,
  },
  unitTextActive: {
    color: Colors.onSecondaryContainer,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    width: "31%",
    aspectRatio: 1.15,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  categoryChipActive: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondaryContainer + "55",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.onSurfaceVariant,
  },
  categoryTextActive: {
    color: Colors.onSecondaryContainer,
  },
  warnRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 8,
  },
  warnText: {
    flex: 1,
    fontSize: 11,
    color: Colors.error,
    lineHeight: 16,
  },
  safety: {
    backgroundColor: Colors.secondaryContainer + "4D",
    borderWidth: 1,
    borderColor: Colors.secondary + "33",
    borderRadius: Radius.xl,
    padding: 20,
    marginVertical: 8,
    gap: 12,
  },
  safetyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  safetyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.onSecondaryFixedVariant,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.onSecondaryFixedVariant,
    lineHeight: 20,
  },
  submit: {
    marginTop: 20,
  },
});
