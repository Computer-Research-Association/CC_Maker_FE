import React, {useContext } from "react" ;
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { TeamContext } from "../screens/TeamContext";



const screenWidth = Dimensions.get("window").width;
const BOX_PER_ROW = 3;
const BOX_SIZE = screenWidth / BOX_PER_ROW;


export default function MissionScreen() {
  const { teamId } = useContext(TeamContext);
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 1학점 */}
      <View style={styles.section}>
        <Text style={styles.title}>1학점</Text>
        <View style={styles.grid}>
          {Array.from({ length: 9 }).map((_, i) => (
            <View
              key={`1-credit-${i}`}
              style={[styles.box, i === 0 && styles.selectedBox]}
            />
          ))}
        </View>
      </View>

      {/* 3학점 */}
      <View style={styles.section}>
        <Text style={styles.title}>3학점</Text>
        <View style={styles.grid}>
          {Array.from({ length: 9 }).map((_, i) => (
            <View key={`3-credit-${i}`} style={styles.box} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
  },
  section: {
    marginBottom: 40,
  },
  title: {
    backgroundColor: "#FFC0C0",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    fontWeight: "bold",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: "#f6f6f6",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  selectedBox: {
    borderWidth: 2,
    borderColor: "#2196F3",
  },
});
