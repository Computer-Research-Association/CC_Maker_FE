import React from "react";
import { View, Text } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import styles from "../styles/MBTIScreenstyles";
import SubmitButton from "../component/SubmitButton";
import { useMbtiScreen } from "../hooks/useMbtiScreen";
import { MbtiSelectionGroup } from "../component/MbtiSelectionGroup";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MbtiScreen">;
};

export default function MBTISelector({ navigation }: Props) {
  const {
    state: { mbti, mbtiOptions },
    computed: { isComplete },
    actions: { handleSelect, showMbtiConfirmation },
  } = useMbtiScreen({ navigation });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MBTI 선택</Text>

      <MbtiSelectionGroup mbti={mbti as any} mbtiOptions={mbtiOptions as any} onSelect={handleSelect as any} />

      <SubmitButton
        title="질문 시작하기"
        buttonColor="#FF9898"
        shadowColor="#E08B8B"
        onPress={showMbtiConfirmation}
        disabled={!isComplete}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}
