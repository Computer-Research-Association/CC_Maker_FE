import React from 'react';
import { View, Text, Modal } from 'react-native';
import SubmitButton from './SubmitButton';
import inquiryModalStyles from '../styles/SettingScreen/InquiryModalStyles';
import creditModalStyles from '../styles/SettingScreen/CreditModalStyles';

type LogoutModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const LogoutModal = ({ visible, onCancel, onConfirm }: LogoutModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={inquiryModalStyles.modalOverlay}>
        <View style={inquiryModalStyles.modalContent}>
          <Text style={inquiryModalStyles.modalTitle}>
            로그아웃 하시겠습니까?
          </Text>
          <View style={creditModalStyles.buttonRow}>
            <SubmitButton
              title="아니오"
              width={130}
              height={50}
              buttonColor="#bbb"
              shadowColor="#aaa"
              onPress={onCancel}
              style={{ marginTop: 2 }}
            />
            <SubmitButton
              title="예"
              width={130}
              height={50}
              buttonColor="#FF9898"
              shadowColor="#E08B8B"
              onPress={onConfirm}
              style={{ marginTop: 2 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
