import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles/MypageScreen.syles';

type MatchedMembersListProps = {
  matchedNames: string[];
};

export const MatchedMembersList = ({ matchedNames }: MatchedMembersListProps) => {
  if (matchedNames.length > 0) {
    return (
      <View style={styles.matchedMembersContainer}>
        {matchedNames.map((memberName, index) => (
          <View key={index} style={styles.matchedMemberItem}>
            {/* 하트 아이콘 */}
            <View style={styles.heartContainer}>
              <Image 
                source={require('../../assets/free-icon-hearts-18745836.png')} 
                style={styles.heartIcon} 
              />
            </View>

            {/* 매칭된 멤버 프로필 */}
            <View style={styles.matchedProfileBlock}>
              <Image 
                source={require('../../assets/user (2).png')} 
                style={[styles.matchedAvatar, { opacity: 0.3, width: 60, height: 60 }]} 
              />
              <Text style={styles.matchedProfileName}>
                {memberName}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.matchedProfileBlock}>
      <Image 
        source={require('../../assets/user (2).png')} 
        style={[styles.matchedAvatar, { opacity: 0.3, width: 60, height: 60 }]} 
      />
      <Text style={styles.matchedProfileName}>
        매칭 대기중
      </Text>
    </View>
  );
};
