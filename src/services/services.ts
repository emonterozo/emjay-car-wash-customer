import Config from 'react-native-config';

import { apiRequest, ApiResponse } from './apiRequest';
import {
  LoginPayload,
  LoginResponse,
  OtpVerifyPayload,
  UserResponse,
  SignupPayload,
  ServicesResponse,
  WashPointsResponse,
  CustomerQueueResponse,
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

export const getServicesRequest = (
  accessToken: string,
  field?: string,
  direction?: 'asc' | 'desc',
  limit?: number,
  offset?: number,
): ApiResponse<ServicesResponse> => {
  return apiRequest<null, ServicesResponse>(`${Config.API_BASE_URL}/services`, {
    method: 'get',
    headers: requestHeader(accessToken),
    params: {
      order_by: JSON.stringify({ field: field ?? 'ratings', direction: direction ?? 'desc' }),
      limit,
      offset,
    },
  });
};

export const getWashPoints = (
  accessToken: string,
  user: string,
): ApiResponse<WashPointsResponse> => {
  return apiRequest<null, WashPointsResponse>(
    `${Config.API_BASE_URL}/customers/${user}/wash-points`,
    {
      method: 'get',
      headers: requestHeader(accessToken),
    },
  );
};

export const getCustomerQueue = (accessToken: string): ApiResponse<CustomerQueueResponse> => {
  return apiRequest<null, CustomerQueueResponse>(
    `${Config.API_BASE_URL}/customers/transactions/queue`,
    {
      method: 'get',
      headers: requestHeader(accessToken),
    },
  );
};
