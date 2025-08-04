import { ChatReference, SizeKey } from '../../types/constant/types';

export const IMAGES = {
  EM_JAY: require('../../../assets/images/emjay.png'),
  EMPTY_STATE: require('../../../assets/images/no-data.png'),
  AVATAR_BOY: require('../../../assets/images/avatar-boy.png'),
  AVATAR_GIRL: require('../../../assets/images/avatar-girl.png'),
  ERROR: require('../../../assets/images/error.png'),
  NO_CONNECTION: require('../../../assets/images/no-connection.png'),
  CANCEL: require('../../../assets/images/cancel.png'),
  WASH_EARN_PROMO: require('../../../assets/images/wash-earn-promo.png'),
  EARNING_POINTS_PROMO: require('../../../assets/images/earning-points-promo.png'),
  POINTS: require('../../../assets/images/points.png'),
  MOTORCYCLE: require('../../../assets/images/motorcycle.png'),
  CAR: require('../../../assets/images/car.png'),
  FREE: require('../../../assets/images/free.png'),
  FIRST: require('../../../assets/images/first.png'),
  SECOND: require('../../../assets/images/second.png'),
  THIRD: require('../../../assets/images/third.png'),
  UPDATE: require('../../../assets/images/update.png'),
  GARAGE: require('../../../assets/images/garage.png'),
  VEHICLE: require('../../../assets/images/vehicle.png'),
  MESSAGING: require('../../../assets/images/messaging.png'),
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
  CancelBooking: {
    title: 'Are you sure you want to cancel this booking?',
    description:
      'If you cancel now, your reserved time slot will be released and cannot be recovered. This action cannot be undone.',
  },
};

export const LIMIT = 50;

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

export const CHAT_REFERENCE: Record<ChatReference, string> = {
  emjay: 'emjay',
  customer: 'customer',
};
