import { ERROR_TYPE } from '@app/constant';
import { ChatReference } from '../constant/types';

export type GenderType = 'MALE' | 'FEMALE';

export type ScreenStatusProps = {
  isLoading: boolean;
  hasError: boolean;
  type: keyof typeof ERROR_TYPE;
};

export type ErrorProps = {
  field: string;
  message: string;
};

export type LoginPayload = {
  contact_number: string;
  password: string;
  fcm_token: string;
};

export type LoginResponse = {
  user: {
    _id: string;
    username: string;
    first_name: string;
    last_name: string;
    gender: GenderType;
    birth_date: string;
  };
  accessToken: string;
  refreshToken: string;
  errors: ErrorProps[];
};

export type SignupPayload = {
  first_name: string;
  last_name: string;
  contact_number: string;
  gender: GenderType;
  birth_date: string;
  password: string;
  fcm_token: string;
};

export type UserResponse = {
  user: {
    _id: string;
    username: string;
  };
  errors: ErrorProps[];
};

export type OtpVerifyPayload = {
  customer_id: string;
  otp: number;
};

export type Price = {
  size: string;
  price: number;
  points: number;
  earning_points: number;
};

export type Service = {
  _id: string;
  title: string;
  description: string;
  image: string;
  type: VehicleType;
  ratings: number;
  reviews_count: number;
  last_review: string | null;
  price_list: Price[];
};

export type ServicesResponse = {
  services: Service[];
  errors: ErrorProps[];
};

export type ServiceCount = {
  size: string;
  count: number;
};

export type Promos = {
  _id: string;
  percent: number;
  title: string;
  description: string;
  is_free: boolean;
  is_active: boolean;
};

export type WashPointsResponse = {
  customer: {
    id: string;
    points: number;
    car_wash_service_count: ServiceCount[];
    moto_wash_service_count: ServiceCount[];
  };
  promos: Promos[];
  errors: ErrorProps[];
};

export type CustomerQueue = {
  _id: string;
  service_name: number;
  status: string;
  date: string;
  description: string;
};

export type CustomerQueueResponse = {
  transactions: CustomerQueue[];
  queue: number;
  errors: ErrorProps[];
};

export type ForgotPasswordVerifyPayload = {
  user: string;
  password: string;
  otp: string;
};

export type TransactionItem = {
  transaction_id: string;
  transaction_availed_service_id: string;
  service_name: string;
  price: number;
  date: string;
};

export type TransactionResponse = {
  transactions: TransactionItem[];
  errors: ErrorProps[];
};

export type Version = {
  _id: string;
  key: string;
  version: string;
};

export type VersionResponse = {
  versions: Version[];
  errors: ErrorProps[];
};

export type UpdateProfileResponse = {
  user: {
    _id: string;
    first_name: string;
    last_name: string;
  };
  errors: ErrorProps[];
};

export type UpdateProfilePayload = {
  first_name?: string;
  last_name?: string;
  password?: string;
  current_password?: string;
};

export type TransactionDetailsResponse = {
  transaction: Omit<
    TransactionServiceDetailsResponse['transaction'],
    'image' | 'status' | 'is_free' | 'is_paid'
  > & {
    first_name: string;
    last_name: string;
    vehicle_type: VehicleType;
    model: string;
    vehicle_size: string;
    plate_number: string;
  };
  errors: ErrorProps[];
};

export type TransactionServiceEmployee = {
  _id: string;
  first_name: string;
  last_name: string;
  gender: string;
};

export type Message = {
  _id: string;
  customer_id: string;
  message: string;
  timestamp: string;
  from: ChatReference;
  is_read: number;
};

export type MessagesResponse = {
  messages: Message[];
  totalCount: number;
  errors: ErrorProps[];
};

export type UpdateMessageStatePayload = {
  view_by: ChatReference;
};

export type UpdateMessageStateResponse = {
  _id: string;
  errors: ErrorProps[];
};
