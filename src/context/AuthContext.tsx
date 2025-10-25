import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../api/client';

interface User {
  id: string;
  email: string;
  nickname: string;
  age_group: string;
  gender: string;
  region: string;
  trust_score: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string, age_group: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 初期ロード時にローカルストレージから復元
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
  try {
    const response = await loginApi({ email, password });
    
    if (response.success) {
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return; // 성공 시 정상 종료
    } else {
      throw new Error(response.message || 'ログインに失敗しました');
    }
  } catch (error: any) {
    console.error('Login error:', error); // 디버깅용
    // 에러 메시지를 더 명확하게
    const errorMessage = error.response?.data?.message || error.message || 'ログインに失敗しました';
    throw new Error(errorMessage);
  }
};

  const register = async (email: string, password: string, nickname: string, age_group: string) => {
    try {
      const response = await registerApi({ email, password, nickname, age_group });
      
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        throw new Error(response.message || '会員登録に失敗しました');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '会員登録に失敗しました');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};