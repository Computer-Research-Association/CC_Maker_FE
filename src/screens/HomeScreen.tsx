import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; //네비게이션을 타입안정성있게 쓰기 위한 도구 

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text>홈 화면입니다</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});