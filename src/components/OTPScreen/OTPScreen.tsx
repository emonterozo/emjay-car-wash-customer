import React, { Dispatch, SetStateAction } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { OTPInput } from '..';

export type MobileOTPScreenProps = {
  number?: string;
  updateUrl?: string;
  onPressUpdate: () => void;
};

export type EmailOtpScreenProps = {
  email?: string;
};

export type OTPPropsBase = {
  headerTitle: string;
  onResendCode: () => void;
  onSubmit: () => void;
  onBack: () => void;
  resendAllowed: boolean;
  remainingTime: string;
  isResendLoading: boolean;
} & OTPInputProps;

export type OTPScreenProps =
  | (OTPPropsBase & { type: 'mobile' } & MobileOTPScreenProps)
  | (OTPPropsBase & { type: 'email' } & EmailOtpScreenProps);

export type OTPInputProps = {
  maxLength?: number;
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
};

const OTPScreen = (props: OTPScreenProps) => {
  const {
    maxLength = 6,
    type,
    headerTitle,
    onResendCode,
    onSubmit,
    otp,
    setOtp,
    onBack,
    resendAllowed,
    remainingTime,
    isResendLoading,
  } = props;

  const handlePressSubmit = () => {
    Keyboard.dismiss();
    onSubmit();
  };

  const formattedNumber = (number: string) => {
    return `${number.slice(0, 3)} ●●● ●●● ${number.slice(number.length - 4, number.length)}`;
  };

  const handlePressBack = () => {
    onBack();
    setOtp('');
  };

  const isDisplayMobileEmail = () => {
    switch (type) {
      case 'mobile':
        return props.number !== undefined;
      case 'email':
        return props.email !== undefined;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.select({
        ios: 45,
      })}
    >
      <View>
        {/* <Header
          titleTestID="otp-header-title"
          title={headerTitle}
          headerIconOnPress={handlePressBack}
          headerIconTestID="otp-header-icon"
        /> */}
        <View style={styles.top}>
          {/* {type === 'mobile' ? <IconMessage /> : <IconEmail />}
          <Typography variant="title" size="semi-bold-sm">
            {type === 'mobile' ? 'Verify via mobile' : 'Check your email'}
          </Typography> */}
        </View>
        <View style={[styles.middle]}>
          {/* <View style={styles.gap}>
            <Typography variant="description" size="sm">
              {`Enter the ${maxLength}-digit code we sent to${
                type === 'mobile' ? ' the number connected to the account' : ''
              }`}
            </Typography>
            {isDisplayMobileEmail() && (
              <Typography variant="title" size="bold-xs">
                {type === 'mobile' ? formattedNumber(props.number!) : props.email}
              </Typography>
            )}
            {type === 'mobile' && (
              <Pressable onPress={props.onPressUpdate}>
                <Typography variant="interactions" size="md" color={colors.ui.primary}>
                  Not my number anymore
                </Typography>
              </Pressable>
            )}
          </View> */}
          <OTPInput otp={otp} setOtp={setOtp} />
          {/* <View style={styles.gap}>
            <Typography variant="description" size="sm" color={colors.text.clear}>
              {resendAllowed
                ? 'Haven’t received your code yet?'
                : `Resend code in ${remainingTime}`}
            </Typography>
            {isResendLoading && <CircularLoader size={35} />}
            {resendAllowed && !isResendLoading && (
              <Pressable onPress={onResendCode}>
                <Typography variant="interactions" size="lg" color={colors.ui.primary}>
                  Send a new code
                </Typography>
              </Pressable>
            )}
          </View> */}
        </View>
      </View>
      {/* <KeyboardAvoidingView behavior="height">
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={['#FBFDFF1A', '#F5F8FC']}
          style={styles.gradient}
        >
          <Button
            testID="submit-button"
            disabled={otp.length < maxLength}
            type="standard"
            variant="primary"
            size="lg"
            title="Submit"
            onPress={handlePressSubmit}
          />
        </LinearGradient>
      </KeyboardAvoidingView> */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 25,
  },
  middle: {
    padding: 20,
    height: 368,
  },
  gap: {
    gap: 8,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default OTPScreen;
