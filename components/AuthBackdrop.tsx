import { ReactNode } from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@constants/index";

interface AuthBackdropProps {
  image: ImageSourcePropType;
  kicker?: string;
  title: string;
  subtitle: string;
  onBack?: () => void;
  children: ReactNode;
}

/**
 * Full-bleed photographic backdrop used across the auth flow. A layered
 * maroon gradient keeps the brand header legible up top and darkens the base
 * so the floating form card reads with strong contrast — a clean, professional
 * "hero image + glass card" pattern.
 */
export function AuthBackdrop({
  image,
  kicker,
  title,
  subtitle,
  onBack,
  children,
}: AuthBackdropProps) {
  return (
    <View style={styles.root}>
      <ImageBackground source={image} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient
          colors={[
            "rgba(48,1,18,0.55)",
            "rgba(48,1,18,0.35)",
            "rgba(35,0,13,0.82)",
            "rgba(20,0,8,0.96)",
          ]}
          locations={[0, 0.32, 0.68, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <SafeAreaView edges={["top"]} style={styles.header} pointerEvents="box-none">
        {onBack && (
          <Pressable
            onPress={onBack}
            style={styles.back}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color={Colors.white} />
          </Pressable>
        )}

        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>🥘</Text>
          </View>
          <Text style={styles.brand}>KINDPLATE</Text>
        </View>

        {kicker && <Text style={styles.kicker}>{kicker}</Text>}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </SafeAreaView>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    marginBottom: 22,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: { fontSize: 22 },
  brand: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 3,
  },
  kicker: {
    color: Colors.primaryFixed,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255,255,255,0.88)",
    maxWidth: 340,
  },
});
