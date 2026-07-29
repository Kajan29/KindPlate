import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Badge, GlassCard, SectionHeader, StoryCard, TopBar } from "@components/index";
import { Colors, Radius, Spacing } from "@constants/index";
import { communityStories, impactStats, personalImpact } from "@data/index";
import { useUserStore } from "@store/useUserStore";

export default function ImpactScreen() {
  const user = useUserStore((s) => s.user);

  const bigStats = [
    {
      icon: "restaurant" as const,
      value: impactStats.mealsSaved.toLocaleString(),
      label: "Meals Saved",
      bg: Colors.sage,
    },
    {
      icon: "people" as const,
      value: `${impactStats.familiesFed}+`,
      label: "Families Fed",
      bg: Colors.secondary,
    },
    {
      icon: "leaf" as const,
      value: `${impactStats.co2SavedTons} Tons`,
      label: "CO₂ Saved",
      bg: Colors.tertiaryContainer,
    },
  ];

  const personalStats = [
    { label: "Shared", value: `${personalImpact.mealsShared} Meals` },
    { label: "Rank", value: personalImpact.rankLabel },
    { label: "Points", value: personalImpact.points.toLocaleString() },
    { label: "Impact", value: `${personalImpact.familiesReached} Families` },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TopBar avatarUrl={user.avatarUrl} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Our Collective Impact</Text>
        <Text style={styles.subtitle}>
          Every meal shared strengthens the spirit of Jaffna. Together, we are building a community
          where no one goes hungry.
        </Text>

        {/* Big stats bento */}
        <View style={styles.bento}>
          {bigStats.map((stat) => (
            <View key={stat.label} style={[styles.bigStat, { backgroundColor: stat.bg }]}>
              <Ionicons name={stat.icon} size={30} color={Colors.white} />
              <View>
                <Text style={styles.bigValue}>{stat.value}</Text>
                <Text style={styles.bigLabel}>{stat.label.toUpperCase()}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Your contribution */}
        <GlassCard style={styles.contribution}>
          <View style={styles.contribHeader}>
            <Text style={styles.contribTitle}>Your Contribution</Text>
            <Badge label={personalImpact.levelLabel} tone="teal" />
          </View>
          <View style={styles.contribGrid}>
            {personalStats.map((s) => (
              <View key={s.label} style={styles.contribItem}>
                <Text style={styles.contribLabel}>{s.label.toUpperCase()}</Text>
                <Text style={styles.contribValue}>{s.value}</Text>
              </View>
            ))}
          </View>
          <View style={styles.progressWrap}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Next Milestone: {personalImpact.nextMilestone}</Text>
              <Text style={styles.progressPct}>{personalImpact.nextMilestoneProgress}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${personalImpact.nextMilestoneProgress}%` }]}
              />
            </View>
          </View>
        </GlassCard>

        {/* Community stories */}
        <View style={styles.storiesSection}>
          <SectionHeader title="Community Stories" actionLabel="View all" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storyCarousel}
        >
          {communityStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </ScrollView>

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Ready to grow your impact?</Text>
          <Text style={styles.ctaSubtitle}>
            Join {impactStats.donorsCount}+ local donors making Jaffna better every day.
          </Text>
          <View style={styles.ctaButtons}>
            <Pressable style={({ pressed }) => [styles.ctaSolid, pressed && styles.ctaPressed]}>
              <Ionicons name="add-circle" size={20} color={Colors.primary} />
              <Text style={styles.ctaSolidText}>Share Surplus Now</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.ctaOutline, pressed && styles.ctaPressed]}>
              <Ionicons name="share-social" size={20} color={Colors.white} />
              <Text style={styles.ctaOutlineText}>Invite a Friend</Text>
            </Pressable>
          </View>
        </View>
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
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: 20,
  },
  bento: {
    gap: 12,
    marginBottom: 24,
  },
  bigStat: {
    height: 120,
    borderRadius: Radius.xl,
    padding: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  bigValue: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.white,
    textAlign: "right",
  },
  bigLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: Colors.white,
    opacity: 0.9,
    textAlign: "right",
  },
  contribution: {
    padding: 20,
    marginBottom: 28,
  },
  contribHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  contribTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
  contribGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  contribItem: {
    width: "50%",
    marginBottom: 16,
    gap: 2,
  },
  contribLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: Colors.onSurfaceVariant,
  },
  contribValue: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.secondary,
  },
  progressWrap: {
    marginTop: 8,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant + "44",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.onSurface,
  },
  progressPct: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.secondary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
  storiesSection: { marginBottom: 4 },
  storyCarousel: {
    gap: 16,
    paddingRight: 8,
    paddingBottom: 8,
    marginBottom: 24,
  },
  cta: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: 28,
    alignItems: "center",
    gap: 8,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
    textAlign: "center",
  },
  ctaSubtitle: {
    fontSize: 15,
    color: Colors.white,
    opacity: 0.85,
    textAlign: "center",
    marginBottom: 12,
  },
  ctaButtons: {
    alignSelf: "stretch",
    gap: 12,
  },
  ctaSolid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: Radius.pill,
    backgroundColor: Colors.white,
  },
  ctaSolidText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },
  ctaOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  ctaOutlineText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.white,
  },
  ctaPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});
