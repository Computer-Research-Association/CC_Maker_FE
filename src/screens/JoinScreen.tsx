import React from "react";
import { View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import styles from "../styles/TeamMemberScreen.styles";
import { useJoinScreen } from "../hooks/useJoinScreen";
import { TeamJoinForm } from "../component/TeamJoinForm";
type JoinTeamScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "JoinScreen">;
};

export default function JoinTeamScreen({ navigation }: JoinTeamScreenProps) {
  const {
    state: { code, loading },
    set: { setCode },
    actions: { handleJoinTeam },
  } = useJoinScreen({ navigation });

  return (
    <View style={styles.container}>
      <TeamJoinForm
        code={code}
        onCodeChange={setCode}
        onJoinTeam={handleJoinTeam}
        loading={loading}
      />
    </View>
  );
}
