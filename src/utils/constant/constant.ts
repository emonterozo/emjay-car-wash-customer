import { SizeKey } from '../../types/constant/types';

export const IMAGES = {
  EM_JAY: require('../../../assets/images/emjay.png'),
  EMPTY_STATE: require('../../../assets/images/no-data.png'),
  QR_ACTIVE: require('../../../assets/images/qr-active.png'),
  QR_INACTIVE: require('../../../assets/images/qr-inactive.png'),
  HOME_ACTIVE: require('../../../assets/images/home-active.png'),
  HOME_INACTIVE: require('../../../assets/images/home-inactive.png'),
  SERVICE_ACTIVE: require('../../../assets/images/service-active.png'),
  SERVICE_INACTIVE: require('../../../assets/images/service-inactive.png'),
  HISTORY_ACTIVE: require('../../../assets/images/history-active.png'),
  HISTORY_INACTIVE: require('../../../assets/images/history-inactive.png'),
  MORE_ACTIVE: require('../../../assets/images/more-active.png'),
  MORE_INACTIVE: require('../../../assets/images/more-inactive.png'),
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
  POINTS: require('../../../assets/images/points.png'),
  MOTORCYCLE: require('../../../assets/images/motorcycle.png'),
  CAR: require('../../../assets/images/car.png'),
  MENU: require('../../../assets/images/menu.png'),
  MESSAGE: require('../../../assets/images/message.png'),
  VIEW_CUSTOMER_PRESENCE: require('../../../assets/images/view-customer-presence.png'),
  FREE: require('../../../assets/images/free.png'),
  PERCENT: require('../../../assets/images/percent.png'),
  FIRST: require('../../../assets/images/first.png'),
  SECOND: require('../../../assets/images/second.png'),
  THIRD: require('../../../assets/images/third.png'),
  UPDATE: require('../../../assets/images/update.png'),
  UPDATE_ICON: require('../../../assets/images/update_icon.png'),
  ROTATE: require('../../../assets/images/rotate.png'),
  PEOPLE_ADS: require('../../../assets/images/people-ads.png'),
  GARAGE: require('../../../assets/images/garage.png'),
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
  SignOut: {
    title: 'Are you sure you want to Sign Out?',
    description: "Once confirmed, you'll be redirected to the Sign In screen.",
  },
};

export const LIMIT = 7;

export const VEHICLE_TYPES = ['Car', 'Motorcycle'];
export const CAR_SIZES = ['Small', 'Medium', 'Large', 'Extra Large'];
export const MOTORCYCLE_SIZES = ['Small', 'Medium', 'Large'];
export const SIZES = ['sm', 'md', 'lg', 'xl'];
export const SIZE_DESCRIPTION: Record<SizeKey, string> = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
};

export const ERR_NETWORK = 'Network Error';

export const NO_DATA = 'No available data';
