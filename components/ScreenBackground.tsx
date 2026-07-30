import { ReactNode } from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppBackgrounds, Colors } from "@constants/index";

interface ScreenBackgroundProps {
  children: ReactNode;
  /** Background photo. Defaults to the warm on-theme meal-hall scene. */
  image?: ImageSourcePropType;
  /**
   * How present the photo is. "subtle" (default) keeps it as a faint,
   * professional texture behind a cream veil so text stays fully legible.
   * "soft" shows a touch more of the image at the top.
   */
  intensity?: "subtle" | "soft";
}

/**
 * App-wide background surface. Instead of a flat cream screen, this lays a
 * softly veiled photograph behind the content for a warmer, more professional
 * feel — while a heavy cream gradient guarantees text and cards stay readable.
 */
export function ScreenBackground({
  children,
  image = AppBackgrounds.primary,
  intensity = "subtle",
}: ScreenBackgroundProps) {
  const veil: [string, string, string, string] =
    intensity === "soft"
      ? [
          "rgba(255,248,247,0.62)",
          "rgba(255,248,247,0.84)",
          "rgba(255,248,247,0.94)",
          "rgba(255,248,247,0.99)",
        ]
      : [
          "rgba(255,248,247,0.90)",
          "rgba(255,248,247,0.94)",
          "rgba(255,248,247,0.97)",
          "rgba(255,248,247,0.99)",
        ];

  return (
    <View style={styles.root}>
      <ImageBackground
        source={image}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <LinearGradient
          colors={veil}
          locations={[0, 0.35, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
});
