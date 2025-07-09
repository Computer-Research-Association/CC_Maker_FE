import React, { useState,useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import styles from '../styles/MypageScreen.syles';
import MbtiScreen from '../screens/MbtiScreen';
import { TeamContext } from './TeamContext';

type MyPageScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MypageScreen'>;
};



export default function MyPageScreen({ navigation }: MyPageScreenProps) {
  
  const { teamId } = useContext(TeamContext);
  const userName = '김예준';
  const month = '7월';
  const writtenCount = 0;

  return (
    <View style={styles.container}>
      {/* ✅ 중앙 정렬된 상단 프로필 */}
   <View style={styles.profileRow}>
  {/* 왼쪽 프로필 */}
  <View style={styles.profileBlock}>
    <View style={styles.avatar} />
    <Text style={styles.name}>{userName}</Text>
  </View>

  {/* 오른쪽 프로필 */}
  <View style={styles.profileBlock}>
    <View style={styles.avatar} />
    <Text style={styles.name}>{userName}</Text>
  </View>
</View>

      {/* ✅ 아이콘 제거됨 */}

      {/* 탭 영역 */}
      <View style={styles.tabRow}>
        <Text style={[styles.tabText, styles.selectedTab]}>다이어리</Text>
      </View>

      {/* 작성 현황 */}
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>
          {month} | 완료한 미션개수 {writtenCount}개
        </Text>
      </View>

      {/* 작성 안내 */}
      <View style={styles.emptyNoteContainer}>
        <Text style={styles.emptyNoteText}>아직 매칭된 상대가 없어요</Text>
        <TouchableOpacity style={styles.writeButtonMain}  onPress={() => navigation.navigate('MbtiScreen')}>
          <Text style={styles.writeButtonMainText} >매칭시작하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
