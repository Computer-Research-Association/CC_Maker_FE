import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, TextInput } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import styles from '../../styles/SignupScreen.styles';

type EmailInputProps = {
  emailId: string;
  emailDomain: string;
  open: boolean;
  domainItems: ItemType<string>[];
  emailError: string;
  setEmailId: (text: string) => void;
  setEmailDomain: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDomainItems: Dispatch<SetStateAction<ItemType<string>[]>>;
};

export const EmailInput = ({
  emailId,
  emailDomain,
  open,
  domainItems,
  emailError,
  setEmailId,
  setEmailDomain,
  setOpen,
  setDomainItems,
}: EmailInputProps) => {
  return (
    <>
      <Text style={styles.label}>이메일</Text>
      <View style={styles.emailRow}>
        <TextInput
          placeholder="이메일 아이디"
          onChangeText={setEmailId}
          value={emailId}
          style={styles.emailInput}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <DropDownPicker
          open={open}
          value={emailDomain}
          items={domainItems}
          setOpen={setOpen}
          setValue={setEmailDomain}
          setItems={setDomainItems}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          containerStyle={styles.dropdownWrapper}
          zIndex={99999}
          zIndexInverse={99999}
          listMode="SCROLLVIEW"
          scrollViewProps={{ nestedScrollEnabled: true, showsVerticalScrollIndicator: false }}
          flatListProps={{ nestedScrollEnabled: true }}
          closeAfterSelecting
          closeOnBackPressed
          textStyle={{ fontFamily: 'Ongeulip', fontSize: 16, color: '#333' }}
        />
      </View>
      {emailError ? (
        <Text style={{ color: 'red', fontSize: 12, marginTop: -15, marginBottom: 10 }}>
          {emailError}
        </Text>
      ) : null}
    </>
  );
};
