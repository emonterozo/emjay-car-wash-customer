export type TUser = {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  fcmToken: string;
};

export type NotificationType = 'promo' | 'transaction' | 'message';

export type TNotification = {
  type: NotificationType;
  id: string;
};
