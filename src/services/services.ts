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
  ForgotPasswordVerifyPayload,
  TransactionResponse,
  VersionResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
  TransactionDetailsResponse,
  MessagesResponse,
  UpdateMessageStateResponse,
  UpdateMessageStatePayload,
  BookingsResponse,
  UpdatingBookingPayload,
  UpdateBookingResponse,
  BookingAction,
  BookingResponse,
} from '../types/services/types';
import { ChatReference } from '../types/constant/types';

export const requestHeader = (accessToken: string) => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
};

export const versionRequest = (): ApiResponse<VersionResponse> => {
  return apiRequest<null, VersionResponse>(
    `${Config.API_BASE_URL}/versions`,
    { method: 'get' },
    '',
  );
};

export const signupRequest = (payload: SignupPayload): ApiResponse<UserResponse> => {
  return apiRequest<SignupPayload, UserResponse>(
    `${Config.API_BASE_URL}/customers`,
    {
      method: 'post',
      data: payload,
    },
    '',
  );
};

export const loginRequest = (payload: LoginPayload): ApiResponse<LoginResponse> => {
  return apiRequest<LoginPayload, LoginResponse>(
    `${Config.API_BASE_URL}/customers/login`,
    {
      method: 'post',
      data: payload,
    },
    '',
  );
};

export const otpVerifyRequest = (payload: OtpVerifyPayload): ApiResponse<LoginResponse> => {
  return apiRequest<OtpVerifyPayload, LoginResponse>(
    `${Config.API_BASE_URL}/customers/otp/verify`,
    {
      method: 'post',
      data: payload,
    },
    '',
  );
};

export const otpRequest = (
  user: string,
  type: 'VERIFICATION' | 'FORGOT',
): ApiResponse<UserResponse> => {
  return apiRequest<{ customer_id: string; message_type: 'VERIFICATION' | 'FORGOT' }, UserResponse>(
    `${Config.API_BASE_URL}/customers/otp/send`,
    {
      method: 'post',
      data: { customer_id: user, message_type: type },
    },
    '',
  );
};

export const getServicesRequest = (
  accessToken: string,
  refreshToken: string,
  field?: string,
  direction?: 'asc' | 'desc',
  limit?: number,
  offset?: number,
): ApiResponse<ServicesResponse> => {
  return apiRequest<null, ServicesResponse>(
    `${Config.API_BASE_URL}/services`,
    {
      method: 'get',
      headers: requestHeader(accessToken),
      params: {
        order_by: JSON.stringify({ field: field ?? 'ratings', direction: direction ?? 'desc' }),
        limit,
        offset,
      },
    },
    refreshToken,
  );
};

export const getWashPoints = (
  accessToken: string,
  refreshToken: string,
  user: string,
): ApiResponse<WashPointsResponse> => {
  return apiRequest<null, WashPointsResponse>(
    `${Config.API_BASE_URL}/customers/${user}/wash-points-promos`,
    {
      method: 'get',
      headers: requestHeader(accessToken),
    },
    refreshToken,
  );
};

export const getCustomerQueue = (
  accessToken: string,
  refreshToken: string,
): ApiResponse<CustomerQueueResponse> => {
  return apiRequest<null, CustomerQueueResponse>(
    `${Config.API_BASE_URL}/transactions/queue`,
    {
      method: 'get',
      headers: requestHeader(accessToken),
    },
    refreshToken,
  );
};

export const forgotPasswordRequest = (username: string): ApiResponse<UserResponse> => {
  return apiRequest<{ contact_number: string }, UserResponse>(
    `${Config.API_BASE_URL}/customers/forgot/password`,
    {
      method: 'post',
      data: { contact_number: username },
    },
    '',
  );
};

export const forgotPasswordVerifyRequest = (
  payload: ForgotPasswordVerifyPayload,
): ApiResponse<LoginResponse> => {
  return apiRequest<ForgotPasswordVerifyPayload, LoginResponse>(
    `${Config.API_BASE_URL}/customers/forgot/password/verify`,
    {
      method: 'post',
      data: payload,
    },
    '',
  );
};

export const getTransactionsRequest = (
  accessToken: string,
  refreshToken: string,
  dateRange: {
    start: string;
    end: string;
  },
  customerId: string,
): ApiResponse<TransactionResponse> => {
  return apiRequest<null, TransactionResponse>(
    `${Config.API_BASE_URL}/transactions/completed`,
    {
      method: 'get',
      headers: requestHeader(accessToken),
      params: {
        date_range: JSON.stringify(dateRange),
        customer_id: customerId,
      },
    },
    refreshToken,
  );
};

export const updateProfile = (
  accessToken: string,
  refreshToken: string,
  id: string,
  payload: UpdateProfilePayload,
): ApiResponse<UpdateProfileResponse> => {
  return apiRequest<UpdateProfilePayload, UpdateProfileResponse>(
    `${Config.API_BASE_URL}/customers/${id}`,
    {
      method: 'patch',
      headers: requestHeader(accessToken),
      data: payload,
    },
    refreshToken,
  );
};

export const getTransactionDetailsRequest = (
  accessToken: string,
  refreshToken: string,
  transactionId: string,
  transactionServiceId: string,
): ApiResponse<TransactionDetailsResponse> => {
  return apiRequest<null, TransactionDetailsResponse>(
    `${Config.API_BASE_URL}/transactions/details`,
    {
      method: 'get',
      headers: requestHeader(accessToken),
      params: {
        transaction_id: transactionId,
        availed_service_id: transactionServiceId,
      },
    },
    refreshToken,
  );
};

export const getMessagesRequest = (
  accessToken: string,
  refreshToken: string,
  customerId: string,
  limit?: number,
  offset?: number,
): ApiResponse<MessagesResponse> => {
  return apiRequest<null, MessagesResponse>(
    `${Config.API_BASE_URL}/messages/${customerId}`,
    {
      method: 'get',
      headers: requestHeader(accessToken),
      params: {
        limit,
        offset,
      },
    },
    refreshToken,
  );
};

export const updateMessageStateRequest = (
  accessToken: string,
  refreshToken: string,
  customerId: string,
  view_by: ChatReference,
): ApiResponse<UpdateMessageStateResponse> => {
  return apiRequest<UpdateMessageStatePayload, UpdateMessageStateResponse>(
    `${Config.API_BASE_URL}/messages/${customerId}`,
    {
      method: 'patch',
      headers: requestHeader(accessToken),
      data: {
        view_by,
      },
    },
    refreshToken,
  );
};

export const getBookingsRequest = (
  accessToken: string,
  refreshToken: string,
): ApiResponse<BookingsResponse> => {
  return apiRequest<null, BookingsResponse>(
    `${Config.API_BASE_URL}/bookings/`,
    {
      method: 'get',
      headers: requestHeader(accessToken),
    },
    refreshToken,
  );
};

export const updateBookingRequest = (
  accessToken: string,
  refreshToken: string,
  date: string,
  slotId: string,
  action: BookingAction,
): ApiResponse<UpdateBookingResponse> => {
  return apiRequest<UpdatingBookingPayload, UpdateBookingResponse>(
    `${Config.API_BASE_URL}/bookings/${date}`,
    {
      method: 'patch',
      headers: requestHeader(accessToken),
      data: {
        slot_id: slotId,
        action,
      },
    },
    refreshToken,
  );
};

export const getBookingRequest = (
  accessToken: string,
  refreshToken: string,
  date: string,
): ApiResponse<BookingResponse> => {
  return apiRequest<null, BookingResponse>(
    `${Config.API_BASE_URL}/bookings/${date}`,
    {
      method: 'get',
      headers: requestHeader(accessToken),
    },
    refreshToken,
  );
};
