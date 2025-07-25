// components/SubmitButton.tsx
import React, { useRef } from "react";
import {
  Text,
  Pressable,
  Animated,
  View,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

type Props = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: object;
  disabled?: boolean;
};

export default function SubmitButton({
  title,
  onPress,
  disabled,
  style,
}: Props) {
  const yAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(yAnim, {
      toValue: 2,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(yAnim, {
      toValue: 0,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.shadowWrapper}>
      <View
        style={[
          styles.shadowLayer,
          disabled && styles.disabledShadowLayer,
          style,
        ]}
      />
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled} // ✅ 여기도 적용
      >
        <Animated.View
          style={[
            styles.submitButton,
            disabled && styles.disabledButton, // ✅ 비활성화 스타일 추가
            { transform: [{ translateY: yAnim }] },
            style,
          ]}
        >
          <Text style={styles.submitText}>{title}</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const BUTTON_WIDTH = 220;
const BUTTON_HEIGHT = 56;

const styles = StyleSheet.create({
  shadowWrapper: {
    alignItems: "center",
    marginTop: 40,
    height: BUTTON_HEIGHT + 8,
  },
  shadowLayer: {
    position: "absolute",
    top: 2,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT + 1.5,
    backgroundColor: "#B54D4D",
    borderRadius: 999,
    zIndex: 0,
  },
  submitButton: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: "#FF9898",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    borderWidth: 2,
    borderColor: "#B54D4D",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    borderColor: "#aaa",
  },
  disabledShadowLayer: {
    backgroundColor: "#999", // 회색으로 변경
  },
});
