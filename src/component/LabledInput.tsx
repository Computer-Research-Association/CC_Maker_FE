import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
//라벨 + 인풋 공통 컴포넌트

type Props = {
  label: string;
  error?: string;
} & TextInputProps;

export const LabeledInput: React.FC<Props> = ({
  label,
  error,
  style,
  ...rest
}) => {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor="#999"
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  field: { marginBottom: 12 },
  label: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
    fontFamily: "Ongeulip",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#fafafa",
    fontFamily: "Ongeulip",
  },
  inputError: { borderColor: "#ff5a5a" },
  errorText: {
    marginTop: 6,
    color: "#ff3b30",
    fontSize: 12,
    fontFamily: "Ongeulip",
  },
});
