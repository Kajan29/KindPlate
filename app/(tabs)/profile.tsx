import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@styles/globalStyles";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.content}>
        <Text style={globalStyles.heading}>Profile</Text>
        <Text style={globalStyles.body}>
          Manage your account and food sharing history.
        </Text>
      </View>
    </SafeAreaView>
  );
}
