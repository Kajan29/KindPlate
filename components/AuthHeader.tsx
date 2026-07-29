import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppImages, Colors, Radius } from "@constants/index";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
}

/**
 * Compact, brand-forward banner shown at the top of the auth screens. Uses a
 * contained image (not full-bleed) with a maroon gradient overlay so it stays
 * legible and tidy on small mobile screens.
 */
export function AuthHeader({ title, subtitle, onBack }: AuthHeaderProps) {
  return (
    <ImageBackground source={AppImages.heroParcel} style={styles.banner} imageStyle={styles.image}>
      <View style={styles.overlay} />
      <SafeAreaView edges={["top"]} style={styles.safe}>
        {onBack && (
          <Pressable onPress={onBack} style={styles.back} hitSlop={10} accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={22} color={Colors.white} />
          </Pressable>
        )}
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>🥘</Text>
          </View>
          <Text style={styles.brand}>KindPlate</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    overflow: "hidden",
  },
  image: {
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(48,1,18,0.7)",
  },
  safe: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
    marginBottom: 20,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceBright,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: { fontSize: 22 },
  brand: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 21,
    maxWidth: 320,
  },
});
