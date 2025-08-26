import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import SubmitButton from './SubmitButton';
import inviteCodeModalStyles from '../styles/SettingScreen/InviteModalStyles';

type InviteCodeModalProps = {
  visible: boolean;
  inviteCode: string | null;
  onCopy: () => void;
  onClose: () => void;
};

export const InviteCodeModal = ({ 
  visible, 
  inviteCode, 
  onCopy, 
  onClose 
}: InviteCodeModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={inviteCodeModalStyles.modalOverlay}>
        <View style={inviteCodeModalStyles.modalContent}>
          <Text style={inviteCodeModalStyles.modalTitle}>초대 코드</Text>
          <View style={inviteCodeModalStyles.codeBox}>
            <Text style={inviteCodeModalStyles.codeText}>{inviteCode}</Text>
            <TouchableOpacity
              onPress={onCopy}
              style={inviteCodeModalStyles.iconButton}
            >
              <Ionicons name="copy-outline" size={24} color="#555" />
            </TouchableOpacity>
          </View>
          <SubmitButton
            onPress={onClose}
            title="확인"
            width={130}
            height={50}
            buttonColor="#bbb"
            shadowColor="#aaa"
            style={{ marginTop: 2 }}
          />
        </View>
      </View>
    </Modal>
  );
};
