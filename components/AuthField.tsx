import { useState } from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius } from "@constants/index";

interface AuthFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon: keyof typeof Ionicons.glyphMap;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
}

/**
 * Labelled, icon-prefixed input used across the auth screens. Includes a
 * built-in show/hide toggle for password fields and a clear focus state.
 */
export function AuthField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  secure = false,
  keyboardType,
  autoCapitalize = "none",
  error,
}: AuthFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secure);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          !!error && styles.fieldError,
        ]}
      >
        <Ionicons name={icon} size={20} color={focused ? Colors.secondary : Colors.onSurfaceVariant} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.onSurfaceVariant + "80"}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} accessibilityLabel="Toggle password visibility">
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={Colors.onSurfaceVariant}
            />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.onSurfaceVariant,
    marginLeft: 4,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 54,
    paddingHorizontal: 14,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    borderRadius: Radius.input,
  },
  fieldFocused: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.white,
  },
  fieldError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.onSurface,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginLeft: 4,
  },
});
