import { SizeKey } from '../../types/constant/types';

export const IMAGES = {
  EM_JAY: require('../../../assets/images/emjay.png'),
  EMPTY_STATE: require('../../../assets/images/no-data.png'),
  SCAN: require('../../../assets/images/scan.png'),
  HOME_ACTIVE: require('../../../assets/images/home-active.png'),
  HOME_INACTIVE: require('../../../assets/images/home-inactive.png'),
  MESSAGES_ACTIVE: require('../../../assets/images/messages-active.png'),
  MESSAGES_INACTIVE: require('../../../assets/images/messages-inactive.png'),
  TRANSACTIONS_ACTIVE: require('../../../assets/images/transactions-active.png'),
  TRANSACTIONS_INACTIVE: require('../../../assets/images/transactions-inactive.png'),
  SETTINGS_ACTIVE: require('../../../assets/images/settings-active.png'),
  SETTINGS_INACTIVE: require('../../../assets/images/settings-inactive.png'),
  CALENDAR_ACTIVE: require('../../../assets/images/calendar-active.png'),
  CALENDAR_INACTIVE: require('../../../assets/images/calendar-inactive.png'),
  AVATAR_BOY: require('../../../assets/images/avatar-boy.png'),
  AVATAR_GIRL: require('../../../assets/images/avatar-girl.png'),
  ERROR: require('../../../assets/images/error.png'),
  NO_CONNECTION: require('../../../assets/images/no-connection.png'),
  MALE: require('../../../assets/images/male.png'),
  FEMALE: require('../../../assets/images/female.png'),
  CANCEL: require('../../../assets/images/cancel.png'),
  HIGH_IMPORTANCE: require('../../../assets/images/high-importance.png'),
  EDIT_PROFILE: require('../../../assets/images/edit-profile.png'),
  NOTIFICATION_SETTINGS: require('../../../assets/images/notification-settings.png'),
  PRIVACY_POLICY: require('../../../assets/images/privacy-policy.png'),
  TERMS_AND_CONDITION: require('../../../assets/images/terms-and-condition.png'),
  SIGN_OUT: require('../../../assets/images/sign-out.png'),
  CLOSE_CIRCLE_BLACK: require('../../../assets/images/close-circle-black.png'),
  CHEVRON_RIGHT_BUTTON: require('../../../assets/images/chevron-right-button.png'),
  WASH_EARN_PROMO: require('../../../assets/images/wash-earn-promo.png'),
  EARNING_POINTS_PROMO: require('../../../assets/images/earning-points-promo.png'),
};

export const ERROR_TYPE = {
  error: {
    title: 'Something went wrong',
    description: "We're actively resolving the issue. Please refresh the page and try again.",
  },
  connection: {
    title: 'No Internet Connection',
    description: 'No internet connections found. Check your connections and try again.',
  },
};

export const CONFIRM_TYPE = {
  Register: {
    title: 'Are you sure you want to cancel account creation?',
    description:
      'If you cancel now, any unsaved information will be lost, and the account will not be created.',
  },
};

export const LIMIT = 7;

export const VEHICLE_TYPES = ['Car', 'Motorcycle'];
export const CAR_SIZES = ['Small', 'Medium', 'Large', 'Extra Large', 'Extra Extra Large'];
export const MOTORCYCLE_SIZES = ['Small', 'Medium', 'Large', 'Extra Large'];
export const SIZES = ['sm', 'md', 'lg', 'xl', 'xxl'];
export const SIZE_DESCRIPTION: Record<SizeKey, string> = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
  xxl: 'Extra Extra Large',
};

export const ERR_NETWORK = 'Network Error';

export const NO_DATA = 'No available data';
