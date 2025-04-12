import { Dispatch, SetStateAction, createContext } from 'react';

import { TUser, TNotification } from '../types/context/types';

const GlobalContext = createContext({
  user: {} as TUser,
  setUser: {} as Dispatch<SetStateAction<TUser>>,
  selectedNotification: {} as TNotification | undefined,
  setSelectedNotification: {} as Dispatch<SetStateAction<TNotification | undefined>>,
});

export default GlobalContext;
