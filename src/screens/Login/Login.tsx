import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ScreenStatusProps } from '../../types/services/types';
import { UnAuthNavigationProp } from '../../types/navigation/types';
import GlobalContext from '@app/context';
import { ERR_NETWORK, IMAGES } from '@app/constant';
import { EyeOpenIcon, EyeCloseIcon } from '@app/icons';
import {
  ErrorModal,
  FormTextInput,
  LoadingAnimation,
  MaterialCommunityIcon,
  Toast,
} from '@app/components';
import { color, font } from '@app/styles';
import { loginRequest } from '@app/services';
import { verticalScale } from '@app/metrics';
import { getCredentials, removeCredentials, storeCredentials } from '@app/helpers';

const Login = () => {
  const { user, setUser } = useContext(GlobalContext);
  const navigation = useNavigation<UnAuthNavigationProp>();
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [screenStatus, setScreenStatus] = useState<ScreenStatusProps>({
    isLoading: false,
    hasError: false,
    type: 'error',
  });
  const [input, setInput] = useState({
    username: '',
    password: '',
  });
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isRemembered, setIsRemembered] = useState(false);

  const login = async () => {
    setScreenStatus({ ...screenStatus, hasError: false, isLoading: true });
    const response = await loginRequest({
      contact_number: input.username,
      password: input.password,
      fcm_token: user.fcmToken,
    });

    setScreenStatus({ ...screenStatus, hasError: false, isLoading: false });

    if (response.success && response.data) {
      switch (response.status) {
        case 201:
          const { _id, username } = response.data.user;
          navigation.navigate('RegistrationOtp', { user: _id, username: username });
          break;
        default:
          const { user: userData, accessToken, refreshToken } = response.data;
          if (isRemembered) {
            storeCredentials(input.username, input.password);
          } else {
            removeCredentials();
          }
          setUser({
            ...userData,
            id: userData._id,
            accessToken,
            refreshToken,
            fcmToken: user.fcmToken,
          });
          break;
      }
    } else {
      switch (response.status) {
        case 401:
          setIsToastVisible(true);
          break;
        default:
          setScreenStatus({
            isLoading: false,
            type: response.error === ERR_NETWORK ? 'connection' : 'error',
            hasError: true,
          });
          break;
      }
    }
  };

  const onToastClose = () => setIsToastVisible(false);

  const toggleModal = () => setScreenStatus({ ...screenStatus, hasError: !screenStatus.hasError });

  const hasNoInput = () => input.username.length === 0 || input.password.length === 0;

  const onChange = (key: string, text: string) => setInput({ ...input, [key]: text });

  const toggleSecureEntry = () => setIsPasswordSecure(!isPasswordSecure);

  const getButtonStyle = (pressed: boolean) => {
    if (hasNoInput()) {
      return {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: color.primary,
      };
    }

    return { backgroundColor: pressed ? color.primary_pressed_state : color.primary };
  };

  const toggleRemembered = () => setIsRemembered(!isRemembered);

  const handleNavigate = (type: 'forgot' | 'signup') => {
    switch (type) {
      case 'forgot':
        navigation.navigate('ForgotPassword');
        break;
      default:
        navigation.navigate('Register');
        break;
    }
  };

  useEffect(() => {
    const fetchCredential = async () => {
      const credential = await getCredentials();

      if (credential) {
        setInput({
          username: credential.username,
          password: credential.password,
        });
        setIsRemembered(true);
      }
    };

    fetchCredential();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <LoadingAnimation isLoading={screenStatus.isLoading} />
      <ErrorModal
        type={screenStatus.type}
        isVisible={screenStatus.hasError}
        onCancel={toggleModal}
        onRetry={login}
      />
      <Toast
        isVisible={isToastVisible}
        message="Oops! Seems like you input wrong details. Please try again."
        duration={3000}
        type="error"
        onClose={onToastClose}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.avoidingView}
      >
        <ScrollView bounces={false} contentContainerStyle={styles.scrollView}>
          <Image source={IMAGES.EM_JAY} style={styles.image} resizeMode="contain" />
          <Text style={styles.header}>We Say Hello!</Text>
          <Text style={styles.subHeader}>Please Login your account {'\u{1F44B}'}</Text>
          <View style={styles.form}>
            <FormTextInput
              label="Phone Number"
              placeholder="E.g 09123456789"
              value={input.username}
              onChangeText={(value) => onChange('username', value)}
              keyboardType="number-pad"
              maxLength={11}
            />
            <FormTextInput
              label="Password"
              placeholder="Password"
              value={input.password}
              onChangeText={(value) => onChange('password', value)}
              secureTextEntry={isPasswordSecure}
              maxLength={64}
              endIcon={
                <Pressable onPress={toggleSecureEntry}>
                  {isPasswordSecure ? <EyeCloseIcon /> : <EyeOpenIcon />}
                </Pressable>
              }
            />
          </View>
          <View style={styles.action}>
            <TouchableOpacity style={styles.rememberContainer} onPress={toggleRemembered}>
              <MaterialCommunityIcon
                name={isRemembered ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                size={20}
                color={isRemembered ? color.primary : '#D9D9D9'}
              />
              <Text style={styles.label}>Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('forgot')}>
              <Text style={[styles.label, { color: color.primary }]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <Pressable
            disabled={hasNoInput()}
            style={({ pressed }) => [styles.button, getButtonStyle(pressed)]}
            onPress={login}
          >
            <Text style={[styles.buttonText, hasNoInput() && { color: color.primary }]}>Login</Text>
          </Pressable>
          <View style={styles.signupContainer}>
            <Text style={styles.label}>Don't have Account?</Text>
            <TouchableOpacity onPress={() => handleNavigate('signup')} style={styles.signupButton}>
              <Text style={styles.signupText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  avoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 25,
    paddingBottom: 25,
  },
  image: {
    width: 245,
    height: 147,
    alignSelf: 'center',
    marginTop: verticalScale(30),
  },
  header: {
    ...font.bold,
    fontSize: 40,
    lineHeight: 40,
    color: '#050303',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    ...font.regular,
    textAlign: 'center',
    color: '#5C5C5C',
    marginTop: 13,
    lineHeight: 21,
  },
  form: {
    gap: 26,
    marginTop: 68,
  },
  action: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  label: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: '#888888',
  },
  button: {
    marginTop: verticalScale(90),
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 49,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width - 48,
    marginBottom: 10,
  },
  buttonText: {
    ...font.regular,
    fontSize: 20,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  signupButton: {
    borderBottomWidth: 1,
    borderColor: color.primary,
    paddingBottom: 1,
  },
  signupText: {
    ...font.bold,
    fontSize: 16,
    lineHeight: 16,
    color: color.primary,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'center',
  },
});

export default Login;
