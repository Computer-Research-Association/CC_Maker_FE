import { useState, useCallback, useEffect } from 'react';

export const usePrivacyAgreement = () => {
  const [privacyAgreed, setPrivacyAgreed] = useState<boolean>(false);
  const [privacyError, setPrivacyError] = useState<string>("");
  const [privacyExpanded, setPrivacyExpanded] = useState<boolean>(false);
  const [privacyContent, setPrivacyContent] = useState<string>("");
  const [privacyVersion, setPrivacyVersion] = useState<string>("");
  const [isLoadingPrivacy, setIsLoadingPrivacy] = useState<boolean>(true);

  const loadPrivacyAgreement = useCallback(async () => {
    try {
      setIsLoadingPrivacy(true);
      const response = await fetch(
        "http://3.39.54.128:8080/api/user/privacy-agreement/current"
      );
      if (response.ok) {
        const data = await response.json();
        setPrivacyContent(data.content);
        setPrivacyVersion(data.version);
      } else {
        setPrivacyContent(
          "개인정보 동의서를 불러올 수 없습니다. 잠시 후 다시 시도해주세요."
        );
        setPrivacyVersion("v1.0");
      }
    } catch (error) {
      setPrivacyContent(
        "개인정보 동의서를 불러올 수 없습니다. 잠시 후 다시 시도해주세요."
      );
      setPrivacyVersion("v1.0");
    } finally {
      setIsLoadingPrivacy(false);
    }
  }, []);

  useEffect(() => {
    loadPrivacyAgreement();
  }, [loadPrivacyAgreement]);

  const togglePrivacyAgreement = useCallback(() => {
    setPrivacyAgreed((prev) => !prev);
    setPrivacyError("");
  }, []);

  const togglePrivacyExpanded = useCallback(() => {
    setPrivacyExpanded((prev) => !prev);
  }, []);

  return {
    privacyAgreed,
    setPrivacyAgreed,
    privacyError,
    setPrivacyError,
    privacyExpanded,
    togglePrivacyExpanded,
    togglePrivacyAgreement,
    privacyContent,
    privacyVersion,
    isLoadingPrivacy,
  };
};
