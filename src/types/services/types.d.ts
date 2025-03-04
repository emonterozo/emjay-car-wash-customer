import { ERROR_TYPE } from '@app/constant';

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
  username: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    gender: GenderType;
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
};

export type UserResponse = {
  user: {
    id: string;
    username: string;
  };
  errors: ErrorProps[];
};

export type OtpVerifyPayload = {
  user: string;
  otp: string;
};

export type Price = {
  size: string;
  price: number;
  points: number;
  earning_points: number;
};

export type Service = {
  id: string;
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

export type WashPointsResponse = {
  customer: {
    id: string;
    points: number;
    car_wash_service_count: ServiceCount[];
    moto_wash_service_count: ServiceCount[];
  };
  errors: ErrorProps[];
};
