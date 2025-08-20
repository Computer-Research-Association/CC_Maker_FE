import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

  // 양 끝으로 갈수록 커지는 원 크기
  const getSize = (index: number) => {
    const sizes = [48, 42, 36, 42, 48]; // 중간이 제일 작음
    return sizes[index];
  };

  const getOffset = (index: number) => {
    const base = 48; // 기준 중심값
    return (base - getSize(index)) / 2;
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }, (_, i) => {
        const size = getSize(i);
        return (
          <TouchableOpacity
            key={i}
            onPress={() => handleSelect(i)}
            style={styles.item}
          >
            <View
              style={[
                styles.circle,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  marginTop: getOffset(i),
                },
                selected === i && styles.selectedCircle,
              ]}
            >
              {selected === i && (
                <Ionicons name="checkmark" size={20} color="white" />
              )}
            </View>
            {i === 0 && <Text style={styles.label}>그렇지 않다</Text>}
            {i === 4 && <Text style={styles.label}>그렇다</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 12,
  },
  item: {
    alignItems: "center",
  },
  circle: {
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 6,
  },
  selectedCircle: {
    backgroundColor: "#FF9494",
    borderColor: "#B54D4D",
  },
  label: {
    fontSize: 12,
    color: "#555",
  },
});
