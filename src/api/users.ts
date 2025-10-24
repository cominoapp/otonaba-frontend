import axios from 'axios';

const API_URL = 'https://otonaba-backend.onrender.com/api';

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  age_group: string;
  trust_score: number;
  created_at: string;
}

export interface UserPosts {
  id: number;
  title: string;
  category: string;
  views: number;
  created_at: string;
  comment_count: number;
  like_count: number;
}

// 사용자 프로필 조회 (닉네임으로)
export const getUserByNickname = async (nickname: string): Promise<UserProfile> => {
  const response = await axios.get(`${API_URL}/users/nickname/${nickname}`);
  return response.data;
};

// 사용자의 게시글 목록
export const getUserPosts = async (userId: string): Promise<UserPosts[]> => {
  const response = await axios.get(`${API_URL}/users/${userId}/posts`);
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