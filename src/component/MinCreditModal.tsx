import React from 'react';
import { View, Text, Modal, TextInput } from 'react-native';
import SubmitButton from './SubmitButton';
import creditModalStyles from '../styles/SettingScreen/CreditModalStyles';

type MinCreditModalProps = {
  visible: boolean;
  minScore: string;
  onMinScoreChange: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export const MinCreditModal = ({ 
  visible, 
  minScore, 
  onMinScoreChange, 
  onSave, 
  onCancel 
}: MinCreditModalProps) => {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={creditModalStyles.modalOverlay}>
        <View style={creditModalStyles.modalContent}>
          <Text style={creditModalStyles.modalTitle}>최소 학점 설정</Text>
          <Text style={creditModalStyles.modalCode}>
            원하는 최소 학점을 입력해주세요
          </Text>
          <TextInput
            style={creditModalStyles.input}
            placeholder="예: 30"
            keyboardType="numeric"
            value={minScore}
            onChangeText={onMinScoreChange}
          />
          <View style={creditModalStyles.buttonRow}>
            <SubmitButton
              title="취소"
              buttonColor="#bbb"
              width={130}
              height={50}
              shadowColor="#aaa"
              onPress={onCancel}
              style={{ marginTop: 2 }}
            />
            <SubmitButton
              title="확인"
              width={130}
              height={50}
              buttonColor="#FF9898"
              shadowColor="#E08B8B"
              onPress={onSave}
              style={{ marginTop: 2 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
