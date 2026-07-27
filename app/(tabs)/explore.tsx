import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@styles/globalStyles";

export default function ExploreScreen() {
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.content}>
        <Text style={globalStyles.heading}>Explore</Text>
        <Text style={globalStyles.body}>
          Discover food shared by people in your community.
        </Text>
      </View>
    </SafeAreaView>
  );
}
