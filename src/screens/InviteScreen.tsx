import React, { useContext } from "react";
import { View, Text, TextInput } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import styles from "../styles/TeamLeaderScreen.styles";
import { TeamContext } from "./TeamContext";
import SubmitButton from "../component/SubmitButton";
import { useInviteScreen } from "../hooks/useInviteScreen";
import BackButton from "../component/BackButton";
import SuccessModal from "../component/SuccessModal";
type InviteScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "InviteScreen">;
};

export default function InviteScreen({ navigation }: InviteScreenProps) {
  const { teamId, setTeamId } = useContext(TeamContext);
  const {
    state: { teamName, teamCode, loading, step, successModalVisible, successMessage },
    set: { setTeamName, setStep },
    computed: { canCreateTeam, hasTeamCode, isStepOne, isStepTwo },
    actions: { fetchInviteCode, copyToClipboard, onCreateTeam, onStartTeam, closeSuccessModal },
  } = useInviteScreen({ teamId, setTeamId });

  const onStartPress = async () => {
    const success = await onStartTeam();
    if (success) {
      navigation.reset({ index: 0, routes: [{ name: "MainHomeScreen" }] });
    }
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <BackButton />
      
      {isStepOne && (
        <>
          <Text style={styles.title}>팀이름을 입력해주세요</Text>
          <Text style={styles.subtitle}>깔쌈하게 만들어주세요</Text>

          <TextInput
            style={styles.input}
            placeholder="팀명"
            value={teamName}
            onChangeText={setTeamName}
            placeholderTextColor="#ccc"
          />

          <SubmitButton onPress={onCreateTeam} title="팀 생성하기" buttonColor="#FFFFFF" shadowColor="#ddd" textColor="#808080" />
        </>
      )}
      {isStepTwo && (
        <>
          <SubmitButton
            title="팀코드 생성하기"
            // style={styles.Button}
            buttonColor="#FFFFFF"
            shadowColor="#ddd"
            onPress={fetchInviteCode}
            disabled={loading}
            textColor="#808080"
          >
            <Text style={styles.laterButtonText}>
              {loading ? "생성 중..." : "팀 코드 생성"}
            </Text>
          </SubmitButton>

          {hasTeamCode && (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.codeText}>생성된 팀 코드: {teamCode}</Text>
              <SubmitButton
                title="코드복사하기"
                buttonColor="#FF9898"
                shadowColor="#E08B8B"
                // style={styles.copyButton}
                onPress={copyToClipboard}
              >
                {/* <Text style={styles.copyButtonText}>코드 복사하기</Text> */}
              </SubmitButton>

              <SubmitButton
                title="시작하기"
                buttonColor="#FF9898"
                shadowColor="#E08B8B"
                onPress={onStartPress}
              >
                <Text style={styles.startButtonText}>시작하기</Text>
              </SubmitButton>
            </View>
                     )}
         </>
       )}

       {/* 성공 모달 */}
       <SuccessModal
         visible={successModalVisible}
         message={successMessage}
         onClose={closeSuccessModal}
       />
     </View>
   );
 }
