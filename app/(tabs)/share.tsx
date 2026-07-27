import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@styles/globalStyles";

export default function ShareScreen() {
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.content}>
        <Text style={globalStyles.heading}>Share Food</Text>
        <Text style={globalStyles.body}>
          Share your extra food with those who need it.
        </Text>
      </View>
    </SafeAreaView>
  );
}
