import React from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

type BackButtonProps = {
  onPress?: () => void;
  style?: any;
};

export default function BackButton({ onPress, style }: BackButtonProps) {
  const navigation = useNavigation();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity 
      style={[
        {
          position: 'absolute',
          top: 45,
          left: 15,
          zIndex: 10,
          padding: 6,
          borderRadius: 16,
          backgroundColor: 'transparent',
        },
        style
      ]} 
      onPress={handlePress}
    >
      <Ionicons name="chevron-back" size={20} color="#666" />
    </TouchableOpacity>
  );
}
