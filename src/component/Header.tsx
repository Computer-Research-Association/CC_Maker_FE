import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import styles from "../styles/MainHomeScreenStyles";

type HeaderProps = {
  onLogout: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Image 
          source={require('../../assets/enter (2).png')} 
          style={styles.logoutIcon} 
        />
      </TouchableOpacity>
    </View>
  );
};
