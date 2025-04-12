import React, { useEffect, useMemo, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Config from 'react-native-config';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';

import {
  Login,
  Register,
  ForgotPassword,
  RegistrationOtp,
  CustomerPresence,
  GettingStarted,
  ForgotPasswordOtp,
  PrivacyPolicy,
  TermsConditions,
  Update,
  Profile,
  EditProfile,
  ChangePassword,
  TransactionDetails,
} from '@app/screens';

import GlobalContext from '@app/context';
import { AuthStackParamList, UnAuthStackParamList } from '../types/navigation/types';
import { TNotification, TUser } from '../types/context/types';
import BottomTab from './BottomTab';
import { getStatusGetStarted, isUpdateAvailable } from '@app/helpers';
import { versionRequest } from '@app/services';

const UnAuthStack = createStackNavigator<UnAuthStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

const Navigation = () => {
  const [isDone, setIsDone] = useState<boolean | null>(null);
  const [user, setUser] = useState<TUser>({
    id: '',
    first_name: '',
    last_name: '',
    gender: '',
    birth_date: '',
    username: '',
    accessToken: '',
    refreshToken: '',
    fcmToken: '',
  });
  const [selectedNotification, setSelectedNotification] = useState<TNotification | undefined>(
    undefined,
  );
  const [hasUpdate, setHasUpdate] = useState(false);

  const initialContext = useMemo(
    () => ({
      user,
      setUser,
      selectedNotification,
      setSelectedNotification,
    }),
    [user, setUser, selectedNotification, setSelectedNotification],
  );

  const requestUserPermission = async () => {
    // Request permissions (required for iOS)
    //await notifee.requestPermission();

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

    const token = await messaging().getToken();
    setUser({
      ...user,
      fcmToken: token,
    });
  };

  const fetchDetails = async () => {
    const response = await versionRequest();
    if (response) {
      const version = response.data?.versions.find((item) => item.key === 'EMJAY_REWARDS')?.version;
      setHasUpdate(isUpdateAvailable(Config.APP_VERSION!, version!));

      const status = await getStatusGetStarted();
      setIsDone(status !== null);
    }
  };

  useEffect(() => {
    requestUserPermission();
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribeForeground = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        const { notification } = detail;
        if (notification?.data) {
          const data = notification.data as TNotification;
          setSelectedNotification({ type: data.type, id: data.id });
        }
      }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        const { notification } = detail;
        if (notification?.data) {
          const data = notification.data as TNotification;
          setSelectedNotification({ type: data.type, id: data.id });
        }
      }
    });

    return () => {
      unsubscribeForeground();
    };
  }, []);

  if (isDone === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <GlobalContext.Provider value={initialContext}>
        {user.id.length > 0 ? (
          <AuthStack.Navigator
            initialRouteName="BottomTab"
            screenOptions={{ headerShown: false, gestureEnabled: false }}
          >
            <AuthStack.Screen name="BottomTab" component={BottomTab} />
            <AuthStack.Screen name="CustomerPresence" component={CustomerPresence} />
            <AuthStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <AuthStack.Screen name="TermsConditions" component={TermsConditions} />
            <AuthStack.Screen name="Profile" component={Profile} />
            <AuthStack.Screen name="EditProfile" component={EditProfile} />
            <AuthStack.Screen name="ChangePassword" component={ChangePassword} />
            <AuthStack.Screen name="TransactionDetails" component={TransactionDetails} />
          </AuthStack.Navigator>
        ) : hasUpdate ? (
          <Update />
        ) : (
          <UnAuthStack.Navigator
            initialRouteName={isDone ? 'Login' : 'GettingStarted'}
            screenOptions={{ headerShown: false }}
          >
            <UnAuthStack.Screen name="GettingStarted" component={GettingStarted} />
            <UnAuthStack.Screen name="Login" component={Login} />
            <UnAuthStack.Screen name="Register" component={Register} />
            <UnAuthStack.Screen name="RegistrationOtp" component={RegistrationOtp} />
            <UnAuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
            <UnAuthStack.Screen name="ForgotPasswordOtp" component={ForgotPasswordOtp} />
          </UnAuthStack.Navigator>
        )}
      </GlobalContext.Provider>
    </NavigationContainer>
  );
};

export default Navigation;
