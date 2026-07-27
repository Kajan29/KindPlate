import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@constants/Colors";
import { FoodItem } from "@types/food";

interface FoodCardProps {
  food: FoodItem;
  onPress?: () => void;
}

export function FoodCard({ food, onPress }: FoodCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${food.title}, ${food.quantity} ${food.unit}, ${food.location.distanceKm}km away`}
    >
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{food.category}</Text>
        </View>
        <Text style={styles.distance}>
          <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
          {" "}{food.location.distanceKm} km
        </Text>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {food.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {food.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.donorInfo}>
          <Ionicons name="person-circle-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.donorName}>{food.donor.name}</Text>
          <Ionicons name="star" size={12} color={Colors.warning} />
          <Text style={styles.rating}>{food.donor.rating}</Text>
        </View>
        <Text style={styles.quantity}>
          {food.quantity} {food.unit}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
    textTransform: "capitalize",
  },
  distance: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 12,
  },
  donorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  donorName: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  rating: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  quantity: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
  },
});
