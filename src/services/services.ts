import Config from 'react-native-config';

import { apiRequest, ApiResponse } from './apiRequest';
import {
  LoginPayload,
  LoginResponse,
  OtpVerifyPayload,
  UserResponse,
  SignupPayload,
} from '../types/services/types';

export const requestHeader = (accessToken: string) => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
};

export const signupRequest = (payload: SignupPayload): ApiResponse<UserResponse> => {
  return apiRequest<SignupPayload, UserResponse>(`${Config.API_BASE_URL}/customers/register`, {
    method: 'post',
    data: payload,
  });
};

export const loginRequest = (payload: LoginPayload): ApiResponse<LoginResponse> => {
  return apiRequest<LoginPayload, LoginResponse>(`${Config.API_BASE_URL}/customers/login`, {
    method: 'post',
    data: payload,
  });
};

export const otpVerifyRequest = (payload: OtpVerifyPayload): ApiResponse<LoginResponse> => {
  return apiRequest<OtpVerifyPayload, LoginResponse>(
    `${Config.API_BASE_URL}/customers/otp/verify`,
    {
      method: 'post',
      data: payload,
    },
  );
};

export const otpRequest = (user: string): ApiResponse<UserResponse> => {
  return apiRequest<{ user: string }, UserResponse>(`${Config.API_BASE_URL}/customers/otp`, {
    method: 'post',
    data: { user },
  });
};
