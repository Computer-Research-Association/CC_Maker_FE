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
  title?: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: object;
  disabled?: boolean;
  children?: React.ReactNode; // ✅ 이거 추가
  width?: number;
  height?: number;
  buttonColor?: string;
  shadowColor?: string;
  paddingHorizontal?: number;
  paddingVertical?: number;
  positionStyle?: object;
  textColor?: string;
};

export default function SubmitButton({
  title,
  onPress,
  disabled,
  style,
  width = 220,
  height = 56,
  buttonColor,
  shadowColor,
  paddingHorizontal, // ← 이 줄 추가
  paddingVertical,
  positionStyle,
  textColor,
}: Props) {
  const yAnim = useRef(new Animated.Value(0)).current;

  // console.log("SubmitButton props", {
  //   title,
  //   buttonColor,
  //   shadowColor,
  //   disabled,
  //   textColor,
  // });

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
    <View style={[styles.shadowWrapper, style, { height: height + 8 }]}>
      <View
        style={[
          styles.shadowLayer,
          disabled && styles.disabledShadowLayer,
          {
            width,
            height: height + 1.5,
            borderRadius: 25,
            backgroundColor: disabled ? "#aaa" : shadowColor,
          },
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
            {
              width,
              height,
              borderRadius: 25,
              transform: [{ translateY: yAnim }],
              backgroundColor: disabled ? "#ccc" : buttonColor,
              borderColor: disabled ? "#aaa" : shadowColor,
              paddingHorizontal, // ← 이 줄 추가
              paddingVertical,
              textColor,
            },
            disabled && styles.disabledButton,
            style,
          ]}
        >
          <Text style={[styles.submitText, { color: textColor || "#fff" }]}>
            {title}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    alignItems: "center",
    marginTop: 40,
    
  },
  shadowLayer: {
    position: "absolute",
    top: 2,
    // backgroundColor: "#B54D4D",
    zIndex: 0,
  },
  submitButton: {
    // backgroundColor: "#FF9898",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    borderWidth: 2,
    // borderColor: "#B54D4D",
  },
  submitText: {
    // color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    borderColor: "#aaa",
  },
  disabledShadowLayer: {
    backgroundColor: "#999",
  },
});
