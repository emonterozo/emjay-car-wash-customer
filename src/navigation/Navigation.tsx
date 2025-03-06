import React, { useEffect, useMemo, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import {
  Login,
  Register,
  ForgotPassword,
  RegistrationOtp,
  CustomerPresence,
  GettingStarted,
  ForgotPasswordOtp,
} from '@app/screens';

import GlobalContext from '@app/context';
import { AuthStackParamList, UnAuthStackParamList } from '../types/navigation/types';
import { TUser } from '../types/context/types';
import BottomTab from './BottomTab';
import { getStatusGetStarted } from '@app/helpers';

const UnAuthStack = createStackNavigator<UnAuthStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

const Navigation = () => {
  const [isDone, setIsDone] = useState<boolean | null>(null);
  const [user, setUser] = useState<TUser>({
    id: '',
    first_name: '',
    last_name: '',
    gender: '',
    username: '',
    accessToken: '',
    refreshToken: '',
  });

  const initialContext = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user, setUser],
  );

  useEffect(() => {
    const fetchGetStarted = async () => {
      const status = await getStatusGetStarted();
      setIsDone(status !== null);
    };

    fetchGetStarted();
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
          </AuthStack.Navigator>
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
