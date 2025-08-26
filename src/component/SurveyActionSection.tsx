import React from 'react';
import { View, Text } from 'react-native';
//@ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import SubmitButton from './SubmitButton';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type SurveyActionSectionProps = {
  matchedNames: string[];
  isSurveyCompleted: boolean;
  navigation: NativeStackNavigationProp<RootStackParamList, "MypageScreen">;
};

export const SurveyActionSection = ({ 
  matchedNames, 
  isSurveyCompleted, 
  navigation 
}: SurveyActionSectionProps) => {
  // 매칭 상대 없고 설문이 완료되지 않은 경우에만 설문 버튼 표시
  if (matchedNames.length === 0 && !isSurveyCompleted) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 10, marginTop: -30 }}>
        <SubmitButton
          title="설문시작하기"
          onPress={() => navigation.navigate("MbtiScreen")}
          buttonColor="#FF9898"
          shadowColor="#E08B8B"
          width={300}
          height={50}
        />
      </View>
    );
  }

  // 설문이 완료된 경우 안내 메시지 표시
  if (matchedNames.length === 0 && isSurveyCompleted) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 10, marginTop: -30 }}>
        <View style={{ 
          backgroundColor: '#f7f8fa', 
          padding: 20, 
          borderRadius: 10, 
          alignItems: 'center',
          width: 300
        }}>
          <Ionicons name="checkmark-circle" size={24} color="#50B889" />
          <Text style={{ 
            marginTop: 8, 
            fontSize: 16, 
            color: '#666', 
            textAlign: 'center',
            fontFamily: 'Ongeulip'
          }}>
            설문조사가 완료되었습니다
          </Text>
          <Text style={{ 
            marginTop: 4, 
            fontSize: 14, 
            color: '#999', 
            textAlign: 'center',
            fontFamily: 'Ongeulip'
          }}>
            매칭 결과를 기다려주세요
          </Text>
        </View>
      </View>
    );
  }

  return null;
};
