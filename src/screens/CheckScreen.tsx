import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles/CheckScreenStyles";
import { useCheckScreen } from "../hooks/useCheckScreen";
import { MatchingButton } from "../component/MatchingButton";
import { MemberList } from "../component/MemberList";
type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CheckScreen">;
};

export default function CheckScreen({ navigation }: Props) {
  const {
    state: { members, matchingStatus },
    computed: { canStartMatching, memberCount },
    actions: { handleStartMatching },
  } = useCheckScreen({ navigation });

  return (
    <View style={styles.container}>
      <MemberList members={members} />

      {/* <Modal
        transparent
        visible={matchingStatus === "loading"}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}> 매칭 중입니다...</Text>
          </View>
        </View>
      </Modal> */}

      {/* <Modal
        transparent
        visible={matchingStatus === "done"}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text
              style={[styles.modalText, { color: "green", marginBottom: 16 }]}
            >
              매칭이 완료되었습니다!
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setMatchingStatus("idle");
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "HomeScreen",
                      params: { teamId: teamId! },
                    },
                  ],
                });
              }}
            >
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

      <MatchingButton
        canStartMatching={canStartMatching}
        memberCount={memberCount}
        onPress={handleStartMatching}
      />
    </View>
  );
}
