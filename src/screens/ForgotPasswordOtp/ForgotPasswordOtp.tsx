import React, { useContext, useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { ScreenStatusProps } from '../../types/services/types';
import { ForgotPasswordOtpRouteProp } from '../../types/navigation/types';
import { color } from '@app/styles';
import { AppHeader, LoadingAnimation, OTPScreen, Toast } from '@app/components';
import { forgotPasswordVerifyRequest, otpRequest } from '@app/services';
import { ERR_NETWORK } from '@app/constant';
import GlobalContext from '@app/context';

const errorMessages: Record<number | string, string> = {
  400: 'OTP already sent. Please check your messages.',
  401: 'The OTP you entered is incorrect. Please try again.',
  410: 'The OTP has expired. Please request a new one.',
  [ERR_NETWORK]: 'No internet connection found. Check your connection and try again.',
  default: 'Something went wrong. Please try again.',
};

const ForgoPasswordOtp = () => {
  const { user, username, password } = useRoute<ForgotPasswordOtpRouteProp>().params;
  const { setUser } = useContext(GlobalContext);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isVisible: false,
    message: '',
    type: 'success',
  });
  const [screenStatus, setScreenStatus] = useState<ScreenStatusProps>({
    isLoading: false,
    hasError: false,
    type: 'error',
  });

  const sendOtp = async () => {
    setScreenStatus({ ...screenStatus, isLoading: true });
    const response = await otpRequest(user, 'FORGOT');

    setScreenStatus({ ...screenStatus, isLoading: false });
    if (response.success && response.data) {
      setToast({
        isVisible: true,
        message: 'OTP has been sent to your phone number. Please check your messages.',
        type: 'success',
      });
    } else {
      setToast({
        isVisible: true,
        message:
          errorMessages[response.status] || errorMessages[response.error!] || errorMessages.default,
        type: 'error',
      });
    }
  };

  const submitOtp = async (otp: string) => {
    setScreenStatus({ ...screenStatus, isLoading: true });
    const response = await forgotPasswordVerifyRequest({
      customer_id: user,
      otp: Number(otp),
      password,
    });

    setScreenStatus({ ...screenStatus, isLoading: false });
    if (response.success && response.data) {
      const { user: userData, accessToken, refreshToken } = response.data;
      setUser({
        ...userData,
        id: userData._id,
        accessToken,
        refreshToken,
      });
    } else {
      setToast({
        isVisible: true,
        message:
          errorMessages[response.status] || errorMessages[response.error!] || errorMessages.default,
        type: 'error',
      });
    }
  };

  const onClose = () => setToast({ ...toast, isVisible: false });
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <AppHeader title="Verification" />
      <LoadingAnimation isLoading={screenStatus.isLoading} />
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        duration={3000}
        type={toast.type}
        onClose={onClose}
      />
      <View style={styles.content}>
        <OTPScreen
          number={`+63${username.slice(1)}`}
          onSubmit={(otp) => submitOtp(otp)}
          onResend={sendOtp}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  content: {
    marginTop: '20%',
    marginHorizontal: 25,
  },
});

export default ForgoPasswordOtp;
