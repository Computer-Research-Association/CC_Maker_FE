import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/SignupScreen.styles';

type PrivacyAgreementSectionProps = {
  privacyExpanded: boolean;
  privacyAgreed: boolean;
  privacyError: string;
  privacyContent: string;
  isLoadingPrivacy: boolean;
  onToggleExpanded: () => void;
  onToggleAgreed: () => void;
};

export const PrivacyAgreementSection = ({
  privacyExpanded,
  privacyAgreed,
  privacyError,
  privacyContent,
  isLoadingPrivacy,
  onToggleExpanded,
  onToggleAgreed,
}: PrivacyAgreementSectionProps) => {
  return (
    <View style={styles.privacySection}>
      <View style={styles.privacyHeader}>
        <Text style={styles.privacyTitle}>개인정보 수집 및 이용 동의</Text>
        <TouchableOpacity style={styles.expandButton} onPress={onToggleExpanded}>
          <Text style={styles.expandButtonText}>{privacyExpanded ? '접기' : '더보기'}</Text>
        </TouchableOpacity>
      </View>

      {privacyExpanded && (
        <View>
          {isLoadingPrivacy ? (
            <Text style={styles.privacyContent}>개인정보 동의서를 불러오는 중...</Text>
          ) : (
            <Text style={styles.privacyContent}>{privacyContent}</Text>
          )}
        </View>
      )}

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, privacyAgreed && styles.checkboxChecked]}
          onPress={onToggleAgreed}
        >
          {privacyAgreed && (
            <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Ongeulip' }}>✓</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>개인정보 수집 및 이용에 동의합니다. (필수)</Text>
      </View>

      {privacyError ? <Text style={styles.checkboxError}>{privacyError}</Text> : null}
    </View>
  );
};
