import React, { useContext,useEffect  } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; //네비게이션을 타입안정성있게 쓰기 위한 도구
import { TeamContext } from "../screens/TeamContext";


type SettingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SettingScreen">;
}; //이 컴포넌트는 navigation이라는 prop을 받고, 객체로 타입을 지정해준다.

export default function SettingsScreen({ navigation }: SettingScreenProps) {
  const { role } = useContext(TeamContext);
  //실험 나중에 지우기
  useEffect(() => {
    console.log("현재 role:", role);
  }, [role]);

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.sectionTitle}>내 활동</Text>
      <SettingItem label="내가 응답한 퀴즈" onPress={() => {}} /> */}

      <Text style={styles.sectionTitle}>내 계정</Text>
      <SettingItem label="계정 관리" onPress={() => {}} />
      <SettingItem label="알림 설정" onPress={() => {}} />
      {/* <SettingItem label="친구 목록 설정" onPress={() => {}} /> */}

      <Text style={styles.sectionTitle}>서비스</Text>
      {/* <SettingItem label="타임스 소식" onPress={() => {}} external />
      <SettingItem label="이용 안내" onPress={() => {}} external />
      <SettingItem label="이용 약관" onPress={() => {}} external />
      <SettingItem label="언어 설정" onPress={() => {}} external /> */}
      <SettingItem label="문의하기" onPress={() => {}} external />
        
      {role === "LEADER" && (
        <SettingItem
          label="매칭시작하기"
          onPress={() => {
            navigation.navigate("CheckScreen");
          }}
          external
        />
      )}
    </ScrollView>
  );
}

type SettingItemProps = {
  label: string;
  onPress: () => void;
  external?: boolean;
};

function SettingItem({ label, onPress, external }: SettingItemProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.arrow}>{external ? "↗" : "›"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: "#888",
    fontSize: 14,
    marginTop: 24,
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  arrow: {
    fontSize: 18,
    color: "#ccc",
  },
});