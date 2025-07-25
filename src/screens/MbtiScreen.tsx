import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import SubmitButton from "../component/SubmitButton";
import QuestionScreen from "./QuestionScreen";
type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MbtiScreen">;
};

export default function MBTISelector({ navigation }: Props) {
  const [mbti, setMbti] = useState<{ [key: string]: string }>({
    EI: "",
    SN: "",
    TF: "",
    JP: "",
  });

  const handleSelect = (key: keyof typeof mbti, value: string) => {
    setMbti((prev) => ({ ...prev, [key]: value }));
  };

  const getMBTI = () => {
    const mbtiString = mbti.EI + mbti.SN + mbti.TF + mbti.JP;
    if (mbtiString.length < 4) {
      Alert.alert("선택 부족", "4가지 모두 선택해주세요.");
      return;
    }
    Alert.alert("당신의 MBTI는", mbtiString);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MBTI 선택</Text>

      <View style={styles.horizontalGroup}>
        {[
          { key: "EI", options: ["E", "I"] },
          { key: "SN", options: ["S", "N"] },
          { key: "TF", options: ["T", "F"] },
          { key: "JP", options: ["J", "P"] },
        ].map(({ key, options }) => (
          <View style={styles.verticalPair} key={key}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.button,
                  mbti[key as keyof typeof mbti] === option && styles.selected,
                ]}
                onPress={() => handleSelect(key as keyof typeof mbti, option)}
              >
                <Text style={styles.buttonText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <SubmitButton title="MBTI 확인" onPress={getMBTI} />

      <SubmitButton
        title="질문 시작하기"
        onPress={() => {
          const mbtiString = mbti.EI + mbti.SN + mbti.TF + mbti.JP;
          if (mbtiString.length < 4) {
            Alert.alert("선택 부족", "MBTI를 모두 선택해주세요.");
            return;
          }
          navigation.navigate("QuestionScreen", {
            index: 0,
            mbti: mbtiString,
            answers: [],
          });
        }}
        disabled={(mbti.EI + mbti.SN + mbti.TF + mbti.JP).length < 4}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const BUTTON_WIDTH = 220;
const BUTTON_HEIGHT = 56;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "bold",
  },
  horizontalGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
    justifyContent: "center",
  },
  verticalPair: {
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 12,
    marginHorizontal: 6,
  },
  button: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  selected: {
    backgroundColor: "#FF9898",
    borderColor: "#FF9898",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
  },
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
});
