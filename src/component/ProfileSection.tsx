import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles/MypageScreen.syles';
import { MatchedMembersList } from '../component/MatchedMembersList';

type ProfileSectionProps = {
  name: string | null;
  matchedNames: string[];
};

export const ProfileSection = ({ name, matchedNames }: ProfileSectionProps) => {
  return (
    <View style={styles.profileSection}>
      <View style={styles.profileContainer}>
        {/* 본인 프로필 */}
        <View style={styles.profileBlock}>
          <Image 
            source={require('../../assets/user (2).png')} 
            style={[styles.avatar, { opacity: 0.3, width: 60, height: 60 }]} 
          />
          <Text style={styles.profileName}>{name || "사용자"}</Text>
        </View>

        {/* 매칭된 멤버들 표시 */}
        <MatchedMembersList matchedNames={matchedNames} />
      </View>
    </View>
  );
};
