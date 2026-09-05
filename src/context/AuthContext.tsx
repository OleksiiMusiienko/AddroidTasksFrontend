import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { TokenType } from '../types/TokensType.ts';
import { loginApi } from '../api/tasksApi.ts';

interface AuthContextType {
  accessToken: string;
  isTokenLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState('');
  const [isTokenLoading, setIsTokenLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');

        if (token) {
          setAccessToken(token);
        } else {
          setAccessToken('');
        }
      } catch (error) {
        console.log('Помилка завантаження токена', error);

        setAccessToken('');
      } finally {
        setIsTokenLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (username: string, password: string) => {
    const tokens: TokenType = await loginApi(username, password);

    console.log('Вхід успішний');

    await AsyncStorage.setItem('accessToken', tokens.access);

    await AsyncStorage.setItem('refreshToken', tokens.refresh);

    setAccessToken(tokens.access);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');

      await AsyncStorage.removeItem('refreshToken');

      setAccessToken('');

      console.log('Вихід успішний');
    } catch (error) {
      console.log('Помилка виходу', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isTokenLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
