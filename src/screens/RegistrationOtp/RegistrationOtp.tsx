import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import { RegistrationOtpRouteProp } from '../../types/navigation/types';
import { color } from '@app/styles';
import { AppHeader, Toast } from '@app/components';
import { otpRequest, otpVerifyRequest } from '@app/services';
import { ERR_NETWORK } from '@app/constant';
import GlobalContext from '@app/context';

const errorMessages: Record<number | string, string> = {
  400: 'OTP already sent. Please check your messages.',
  401: 'The OTP you entered is incorrect. Please try again.',
  410: 'The OTP has expired. Please request a new one.',
  [ERR_NETWORK]: 'No internet connection found. Check your connection and try again.',
  default: 'Something went wrong. Please try again.',
};

const RegistrationOtp = () => {
  const { user } = useRoute<RegistrationOtpRouteProp>().params;
  const { setUser } = useContext(GlobalContext);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(300);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const sendOtp = async () => {
    const response = await otpRequest(user);

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

  const submitOtp = async () => {
    const response = await otpVerifyRequest({ user, otp });

    if (response.success && response.data) {
      const { user: userData, accessToken, refreshToken } = response.data;
      setUser({
        ...userData,
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

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    setOtp('');
    setTimer(300);
    setResendDisabled(true);
    sendOtp();
  };

  const onClose = () => setToast({ ...toast, isVisible: false });
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <AppHeader title="Register" />
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        duration={3000}
        type={toast.type}
        onClose={onClose}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>We have sent a 6-digit code to your phone.</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />

        <Text style={styles.timer}>
          {timer > 0
            ? `Resend in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`
            : 'You can now resend OTP'}
        </Text>

        <TouchableOpacity
          style={[styles.resendButton, resendDisabled && styles.disabledButton]}
          onPress={handleResend}
          disabled={resendDisabled}
        >
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.resendButton, otp.length < 6 && styles.disabledButton]}
          onPress={submitOtp}
          disabled={otp.length < 6}
        >
          <Text style={styles.resendText}>Submit</Text>
        </TouchableOpacity>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  timer: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  resendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  resendText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RegistrationOtp;
