import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // expo 사용 시

type LikertScaleProps = {
  question: string;
  onSelect: (value: number) => void;
};

export default function LikertScale({ question, onSelect }: LikertScaleProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelected(index);
    onSelect(index);
  };

  return (
    <View>
      <View style={styles.scaleRow}>
        <Text style={styles.label}>그렇다</Text>
        {Array.from({ length: 5 }, (_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleSelect(i)}
            style={[styles.circle, selected === i && styles.selectedCircle]}
          >
            {selected === i && (
              <Ionicons name="checkmark" size={18} color="white" />
            )}
          </TouchableOpacity>
        ))}
        <Text style={styles.label}>그렇지 않다</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scaleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  label: {
    fontSize: 12,
    color: "#555",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCircle: {
    backgroundColor: "#50B889",
    borderColor: "#50B889",
  },
});
