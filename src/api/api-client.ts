import axios from 'axios';

// API 베이스 URL
const API_BASE_URL = 'http://localhost:5000/api';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰을 자동으로 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료시 로그아웃
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 회원가입
export const register = async (userData: {
  email: string;
  password: string;
  nickname: string;
  age_group: string;
}) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

// 로그인
export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export default apiClient;
