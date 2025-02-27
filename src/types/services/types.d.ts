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
  };
  errors: ErrorProps[];
};

export type OtpVerifyPayload = {
  user: string;
  otp: string;
};
