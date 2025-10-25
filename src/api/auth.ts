import axios from 'axios';

const API_URL = 'https://otonaba-backend.onrender.com/api';

export interface User {
  id: string;
  email: string;
  nickname: string;
  age_group: string;
  gender: string;
  region: string;
  trust_score: number;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const register = async (
  email: string,
  password: string,
  nickname: string,
  age_group: string,
  gender: string,
  region: string
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
    nickname,
    age_group,
    gender,
    region
  });
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
};

export const getProfile = async (token: string): Promise<User> => {
  const response = await axios.get(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 비밀번호 변경
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  token: string
): Promise<void> => {
  await axios.put(
    `${API_URL}/auth/change-password`,
    { currentPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// プロフィール更新
export const updateProfile = async (
  nickname: string,
  age_group: string,
  gender: string,
  region: string,
  token: string
): Promise<User> => {
  const response = await axios.put(
    `${API_URL}/auth/profile`,
    { nickname, age_group, gender, region },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.user;
};