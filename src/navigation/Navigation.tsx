import React, { useMemo, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { Login, Register, ForgotPassword, RegistrationOtp, CustomerPresence } from '@app/screens';
import GlobalContext from '@app/context';
import { AuthStackParamList } from '../types/navigation/types';
import { TUser } from '../types/context/types';
import BottomTab from './BottomTab';

const UnAuthStack = createStackNavigator();
const AuthStack = createStackNavigator<AuthStackParamList>();

const Navigation = () => {
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
          <UnAuthStack.Navigator screenOptions={{ headerShown: false }}>
            <UnAuthStack.Screen name="Login" component={Login} />
            <UnAuthStack.Screen name="Register" component={Register} />
            <UnAuthStack.Screen name="RegistrationOtp" component={RegistrationOtp} />
            <UnAuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
          </UnAuthStack.Navigator>
        )}
      </GlobalContext.Provider>
    </NavigationContainer>
  );
};

export default Navigation;
