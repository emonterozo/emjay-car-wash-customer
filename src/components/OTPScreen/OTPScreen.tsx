import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

import { color, font } from '@app/styles';

type OTPScreenProps = {
  number: string;
  length?: number;
  onSubmit: (otp: string) => void;
  onResend: () => void;
};

const OTPScreen = ({ length = 6, number, onSubmit, onResend }: OTPScreenProps) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [timer, setTimer] = useState(300);
  const [showResend, setShowResend] = useState(false);

  const handleChange = (value: string, index: number) => {
    if (isNaN(parseInt(value, 10))) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if value is entered
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (value: string, index: number) => {
    const newOtp = [...otp];

    if (!value && index > 0) {
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
    } else {
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const isOtpComplete = otp.every((digit) => digit.trim() !== '');

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setShowResend(true); // Show resend button after 5 minutes
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <View>
      <View style={styles.content}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.description}>
            {`Enter the 6-digit code sent to ${number}. This code is valid for the next 5 minutes.`}
          </Text>
        </View>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputsRef.current[index] = ref)}
              style={[styles.input, focusedIndex === index && styles.filled]}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
              onKeyPress={({ nativeEvent }) =>
                nativeEvent.key === 'Backspace' && handleBackspace(digit, index)
              }
              placeholder="-"
              placeholderTextColor="#888888"
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
            />
          ))}
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            isOtpComplete && { backgroundColor: color.primary },
            pressed && { backgroundColor: color.primary_pressed_state },
          ]}
          disabled={!isOtpComplete}
          onPress={() => {
            Keyboard.dismiss();
            onSubmit(otp.join(''));
          }}
        >
          <Text style={[styles.buttonText, !isOtpComplete && { color: color.primary }]}>
            Continue
          </Text>
        </Pressable>
      </View>
      <View style={styles.resendContainer}>
        <Text style={styles.resendDescription}>Didn't get the code?</Text>
        {showResend ? (
          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => {
              Keyboard.dismiss();
              onResend();
              setOtp(new Array(length).fill(''));
            }}
          >
            <Text style={styles.resend}>Resend code</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.resend}>Resend in {formatTime(timer)}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 40,
  },
  descriptionContainer: {
    gap: 16,
    alignItems: 'center',
  },
  title: {
    ...font.bold,
    fontSize: 24,
    lineHeight: 24,
    color: '#050303',
  },
  description: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: '#888888',
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  input: {
    width: (Dimensions.get('window').width - 75) / 6,
    height: 71,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 24,
    borderColor: '#888888',
    ...font.regular,
    fontSize: 20,
    lineHeight: 20,
    color: '#000000',
  },
  filled: {
    borderColor: color.primary,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: color.primary,
  },
  buttonText: {
    ...font.regular,
    fontSize: 20,
    lineHeight: 20,
    color: '#F3F2EF',
  },
  resendContainer: {
    marginTop: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  resendDescription: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: '#888888',
  },
  resend: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: color.primary_pressed_state,
  },
  resendButton: {
    borderBottomWidth: 1,
    borderColor: color.primary_pressed_state,
    paddingBottom: 1,
  },
});

export default OTPScreen;
