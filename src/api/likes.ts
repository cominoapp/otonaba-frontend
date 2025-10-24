import axios from 'axios';

const API_URL = 'https://otonaba-backend.onrender.com/api';

export interface LikeResponse {
  isLiked: boolean;
  likeCount: number;
  message: string;
}

// 좋아요 여부 확인
export const checkLike = async (postId: number, token: string): Promise<{ isLiked: boolean }> => {
  const response = await axios.get(`${API_URL}/likes/posts/${postId}/check`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 좋아요 토글
export const toggleLike = async (postId: number, token: string): Promise<LikeResponse> => {
  const response = await axios.post(
    `${API_URL}/likes/posts/${postId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};