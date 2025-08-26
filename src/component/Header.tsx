import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";

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

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoutButton: {
    padding: 8,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: "#666",
  },
});
