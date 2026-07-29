import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius } from "@constants/index";

interface CountdownBadgeProps {
  /** Minutes remaining until the freshness limit at the time this mounts. */
  minutesLeft: number;
  /** Larger variant used on the donation detail screen. */
  large?: boolean;
  /** Hide the leading clock icon. */
  hideIcon?: boolean;
}

type Level = "fresh" | "warn" | "critical" | "expired";

/** green -> amber -> red as the 6-hour cooked-food window runs down. */
function levelFor(secs: number): Level {
  if (secs <= 0) return "expired";
  if (secs <= 60 * 60) return "critical"; // under 1 hour
  if (secs <= 120 * 60) return "warn"; // under 2 hours
  return "fresh";
}

const PALETTE: Record<Level, { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  fresh: { bg: "rgba(76,175,80,0.16)", fg: "#2e7d32", icon: "time-outline" },
  warn: { bg: "rgba(249,212,90,0.28)", fg: "#8a6d00", icon: "time-outline" },
  critical: { bg: Colors.errorContainer, fg: Colors.onErrorContainer, icon: "alarm-outline" },
  expired: { bg: Colors.surfaceContainerHigh, fg: Colors.onSurfaceVariant, icon: "close-circle-outline" },
};

function fmt(totalSecs: number) {
  if (totalSecs <= 0) return "Expired";
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * A live-ticking freshness countdown — the single most time-sensitive element
 * in the admin UI. It shifts green -> amber -> red and gently pulses in the
 * final hour.
 */
export function CountdownBadge({ minutesLeft, large = false, hideIcon = false }: CountdownBadgeProps) {
  const expiryRef = useRef<number>(Date.now() + minutesLeft * 60 * 1000);
  const [secs, setSecs] = useState(() =>
    Math.max(0, Math.round((expiryRef.current - Date.now()) / 1000))
  );
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const id = setInterval(() => {
      const next = Math.max(0, Math.round((expiryRef.current - Date.now()) / 1000));
      setSecs(next);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const level = levelFor(secs);

  useEffect(() => {
    if (level !== "critical") {
      pulse.stopAnimation();
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.55, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [level, pulse]);

  const palette = PALETTE[level];

  return (
    <Animated.View
      style={[
        styles.badge,
        large && styles.large,
        { backgroundColor: palette.bg, opacity: level === "critical" ? pulse : 1 },
      ]}
    >
      {!hideIcon && (
        <Ionicons name={palette.icon} size={large ? 18 : 13} color={palette.fg} />
      )}
      <Text style={[styles.text, large && styles.textLarge, { color: palette.fg }]}>
        {fmt(secs)}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    alignSelf: "flex-start",
  },
  large: {
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  text: {
    fontSize: 13,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    letterSpacing: 0.5,
  },
  textLarge: {
    fontSize: 18,
  },
});
