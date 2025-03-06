import AsyncStorage from '@react-native-async-storage/async-storage';

export const formattedNumber = (amount: number, fractionDigits?: number) => {
  return `₱${new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: fractionDigits ?? 2,
    maximumFractionDigits: fractionDigits ?? 2,
  }).format(amount)}`;
};

export const isStringEmpty = (value: string) => {
  return value.length === 0;
};

export const getCurrentDateAtMidnightUTC = () => {
  const now = new Date();
  now.setUTCDate(now.getUTCDate());
  now.setUTCHours(0, 0, 0, 0);

  return now;
};

export const getMinimumDateAtMidnightUTC = () => {
  const now = new Date('1900-01-31');
  now.setUTCDate(now.getUTCDate());
  now.setUTCHours(0, 0, 0, 0);
  return now;
};

export const isValidDateString = (dateStr: string) => /^(\d{2})\/(\d{2})\/(\d{4})$/.test(dateStr);

export const shortenNumber = (num: number) => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'K';
  }
  return num.toString();
};

export const areObjectsEqual = <T extends Record<string, any>>(
  firstObj: T,
  secondObj: T,
): boolean => {
  const firstKeys = Object.keys(firstObj);
  const secondKeys = Object.keys(secondObj);

  if (firstKeys.length !== secondKeys.length) {
    return false;
  }

  return firstKeys.every((key) => firstObj[key] === secondObj[key]);
};

export const storeUsername = async (username: string) => {
  await AsyncStorage.setItem('username', username);
};

export const getUsername = async () => {
  const value = await AsyncStorage.getItem('username');
  return value;
};

export const removeUsername = async () => {
  await AsyncStorage.removeItem('username');
};

export const storeStatusGetStarted = async () => {
  await AsyncStorage.setItem('get-started', 'done');
};

export const getStatusGetStarted = async () => {
  const value = await AsyncStorage.getItem('get-started');
  return value;
};
