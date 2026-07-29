import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Shadows } from "@constants/index";
import { CommunityStory } from "@/types/food";

export function StoryCard({ story }: { story: CommunityStory }) {
  return (
    <View style={styles.card}>
      <Image source={story.image} style={styles.image} />
      <View style={styles.body}>
        <View style={styles.stars}>
          {Array.from({ length: story.rating }).map((_, i) => (
            <Ionicons key={i} name="star" size={14} color={Colors.sage} />
          ))}
        </View>
        <Text style={styles.quote}>&ldquo;{story.quote}&rdquo;</Text>
        <Text style={styles.author}>
          — {story.author}, {story.role}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "33",
    ...Shadows.soft,
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  body: {
    padding: 18,
    gap: 10,
  },
  stars: {
    flexDirection: "row",
    gap: 3,
  },
  quote: {
    fontSize: 14,
    lineHeight: 21,
    fontStyle: "italic",
    color: Colors.onSurfaceVariant,
  },
  author: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
  },
});
