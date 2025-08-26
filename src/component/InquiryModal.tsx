import React from 'react';
import { View, Text, Modal } from 'react-native';
import SubmitButton from './SubmitButton';
import inquiryModalStyles from '../styles/SettingScreen/InquiryModalStyles';

type InquiryModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const InquiryModal = ({ visible, onClose }: InquiryModalProps) => {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={inquiryModalStyles.modalOverlay}>
        <View style={inquiryModalStyles.modalContent}>
          <Text style={inquiryModalStyles.modalTitle}>문의하기</Text>
          <Text style={inquiryModalStyles.modalCode}>
            문의는 아래 이메일로 보내주세요.
          </Text>
          <Text style={inquiryModalStyles.modalCodeEmail}>
            📧 example@email.com
          </Text>

          <SubmitButton
            title="확인"
            buttonColor="#bbb"
            width={130}
            height={50}
            shadowColor="#aaa"
            onPress={onClose}
            style={{ marginTop: 2 }}
          />
        </View>
      </View>
    </Modal>
  );
};
