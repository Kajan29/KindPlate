import { useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ImageSourcePropType } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppImages, Colors, Radius } from "@constants/index";

const { width } = Dimensions.get("window");

interface Slide {
  kicker: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
}

const SLIDES: Slide[] = [
  {
    kicker: "THE NEED",
    title: "Nalla unavu,\nsariyaana idathukku.",
    subtitle: "A meal saved is a family fed.",
    image: AppImages.heroParcel,
  },
  {
    kicker: "THE BRIDGE",
    title: "Surplus food,\ndelivered with care.",
    subtitle: "Every donation tracked, every delivery verified.",
    image: AppImages.volunteerDelivery,
  },
  {
    kicker: "THE COMMUNITY",
    title: "One app. Four roles.\nZero food wasted.",
    subtitle:
      "Empowering donors, volunteers and partners to nourish Jaffna together.",
    image: AppImages.communityMeal,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const goToLogin = () => router.replace("/login");

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      const next = index + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setIndex(next);
    } else {
      goToLogin();
    }
  };

  const isLast = index === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
      >
        {SLIDES.map((slide, i) => (
          <ImageBackground
            key={i}
            source={slide.image}
            style={[styles.slide, { width }]}
          >
            <LinearGradient
              colors={[
                "rgba(23,67,63,0.35)",
                "rgba(23,67,63,0.45)",
                "rgba(20,4,12,0.9)",
              ]}
              locations={[0, 0.45, 1]}
              style={styles.overlay}
            />
          </ImageBackground>
        ))}
      </ScrollView>

      {/* Foreground content overlaid on top of the pager */}
      <SafeAreaView style={styles.foreground} pointerEvents="box-none">
        <Text style={styles.brand}>KINDPLATE</Text>

        <View style={styles.center} pointerEvents="none">
          <Text style={styles.kicker}>{SLIDES[index].kicker}</Text>
          <Text style={styles.title}>{SLIDES[index].title}</Text>
          <Text style={styles.subtitle}>{SLIDES[index].subtitle}</Text>
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === index ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleNext}
            accessibilityRole="button"
            style={({ pressed }) => [styles.nextBtn, pressed && styles.pressed]}
          >
            <Text style={styles.nextText}>{isLast ? "Get Started" : "Next"}</Text>
            <Ionicons
              name={isLast ? "checkmark" : "arrow-forward"}
              size={20}
              color={Colors.primary}
            />
          </Pressable>
          <Pressable onPress={goToLogin} accessibilityRole="button" style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  slide: {
    flex: 1,
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(23, 67, 63, 0.6)",
  },
  foreground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  brand: {
    textAlign: "center",
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 4,
    opacity: 0.85,
    marginTop: 8,
  },
  center: {
    alignItems: "center",
    gap: 14,
  },
  kicker: {
    color: Colors.primaryFixed,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 3,
  },
  title: {
    textAlign: "center",
    color: Colors.white,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    color: Colors.secondaryContainer,
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 300,
    opacity: 0.95,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  dot: {
    borderRadius: 999,
  },
  dotActive: {
    width: 24,
    height: 8,
    backgroundColor: Colors.primaryFixed,
  },
  dotInactive: {
    width: 8,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  actions: {
    gap: 8,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    borderRadius: Radius.pill,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  nextText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  skipBtn: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
