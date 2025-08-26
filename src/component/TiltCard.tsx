import React, { useRef } from "react";
import { TouchableOpacity, Animated, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

type TiltCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
};

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  style,
  onPress,
  disabled = false,
}) => {
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: rotateY, translationY: rotateX } }],
    {
      useNativeDriver: false,
      listener: (e: any) => {
        const { translationX, translationY } = e.nativeEvent;
        rotateY.setValue(translationX / 4);
        rotateX.setValue(-translationY / 4);
      },
    }
  );

  const onHandlerStateChange = (e: any) => {
    if (e.nativeEvent.state === State.END) {
      Animated.parallel([
        Animated.spring(rotateX, { 
          toValue: 0, 
          useNativeDriver: false, 
          tension: 40, 
          friction: 8,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        }),
        Animated.spring(rotateY, { 
          toValue: 0, 
          useNativeDriver: false, 
          tension: 40, 
          friction: 8,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        }),
      ]).start();
    }
  };

  const animatedStyle = {
    transform: [
      { perspective: 800 },
      { rotateX: rotateX.interpolate({ 
        inputRange: [-40, 40], 
        outputRange: ["-15deg", "15deg"], 
        extrapolate: "clamp" 
      }) },
      { rotateY: rotateY.interpolate({ 
        inputRange: [-40, 40], 
        outputRange: ["-15deg", "15deg"], 
        extrapolate: "clamp" 
      }) },
    ],
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      enabled={!disabled}
    >
      <Animated.View style={[style, animatedStyle]}>
        {onPress && (
          <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={StyleSheet.absoluteFillObject}
            activeOpacity={0.95}
          />
        )}
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};
