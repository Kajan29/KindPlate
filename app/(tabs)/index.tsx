import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@styles/globalStyles";
import { FoodCard } from "@components/FoodCard";
import { useFoodStore } from "@store/foodStore";

export default function HomeScreen() {
  const { foodItems } = useFoodStore();

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.content}>
        <Text style={globalStyles.heading}>Available Food Near You</Text>
        <FlatList
          data={foodItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FoodCard food={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={globalStyles.emptyText}>
              No food available right now. Check back later!
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}
