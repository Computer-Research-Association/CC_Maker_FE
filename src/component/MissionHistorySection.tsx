import React from 'react';
import { View, Text, Image } from 'react-native';
//@ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from '../styles/MypageScreen.syles';
import { MissionHistory } from '../types/mission';
import { getIconName, formatDate } from '../utils/missionUtils';

type MissionHistorySectionProps = {
  missionHistory: MissionHistory[];
};

export const MissionHistorySection = ({ missionHistory }: MissionHistorySectionProps) => {
  return (
    <View style={styles.missionHistorySection}>
      <View style={styles.sectionHeader}>
        <Ionicons name="calendar-outline" size={20} color="#666" />
        <Text style={styles.sectionTitle}>미션 히스토리</Text>
      </View>

      <View style={styles.timelineContainer}>
        {/* 타임라인 라인 */}
        <View style={styles.timelineLine} />
        
        {/* 미션 항목들 */}
        {missionHistory.length > 0 ? (
          missionHistory.map((mission, index) => (
            <View key={mission.id} style={styles.missionItem}>
              {/* 미션 아이콘 */}
              <View style={[
                styles.missionIcon,
                styles.completedIcon
              ]}>
                <Ionicons 
                  name={getIconName(mission.missionScore)} 
                  size={16} 
                  color="#fff"
                />
              </View>

              {/* 미션 카드 */}
              <View style={[
                styles.missionCard,
                styles.completedCard
              ]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.missionTitle}>{mission.userName}</Text>
                  <Image 
                    source={require('../../assets/free-icon-hearts-18745836.png')} 
                    style={{ width: 18, height: 18, marginHorizontal: 8 }}
                  />
                  <Text style={styles.missionTitle}>
                    {mission.matchedNames && mission.matchedNames.length > 0 
                      ? mission.matchedNames.join(" ♥ ")
                      : "매칭 대기중"
                    }
                  </Text>
                </View>
                <Text style={styles.missionDate}>{formatDate(mission.completedAt)}</Text>
                <View style={styles.missionDescription}>
                  <Ionicons name="chatbubble-outline" size={14} color="#999" />
                  <Text style={styles.descriptionText}>{mission.missionDescription}</Text>
                </View>
                <Text style={styles.descriptionText}>+{mission.missionScore}점</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Ionicons name="calendar-outline" size={40} color="#ccc" />
            <Text style={{ marginTop: 10, fontSize: 16, color: '#666', fontFamily: 'Ongeulip' }}>
              아직 완료된 미션이 없어요
            </Text>
            <Text style={{ marginTop: 5, fontSize: 14, color: '#999', fontFamily: 'Ongeulip' }}>
              미션을 완료하면 여기에 기록됩니다!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
