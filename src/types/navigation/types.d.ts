import type { StackScreenProps } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

export type AuthStackParamList = {
  BottomTab: undefined;
  CustomerPresence: undefined;
  PrivacyPolicy: undefined;
  TermsConditions: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  TransactionDetails: { transactionId: string; transactionServiceId: string };
  Message: undefined;
  Booking: undefined;
};

export type UnAuthStackParamList = {
  GettingStarted: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  RegistrationOtp: { user: string; username: string };
  ForgotPasswordOtp: { user: string; username: string; password: string };
};

export type NavigationProp = StackScreenProps<AuthStackParamList>['navigation'];
export type UnAuthNavigationProp = StackScreenProps<UnAuthStackParamList>['navigation'];

export type RegistrationOtpRouteProp = RouteProp<UnAuthStackParamList, 'RegistrationOtp'>;
export type ForgotPasswordOtpRouteProp = RouteProp<UnAuthStackParamList, 'ForgotPasswordOtp'>;

export type TransactionDetailsRouteProp = RouteProp<AuthStackParamList, 'TransactionDetails'>;
