import axios from 'axios';

const API_URL = 'https://otonaba-backend.onrender.com/api';

export interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_nickname: string;
  author_age_group: string;
  author_gender: string;      // ← 추가
  author_region: string;       // ← 추가
}

// 댓글 목록 조회
export const getComments = async (postId: number): Promise<Comment[]> => {
  const response = await axios.get(`${API_URL}/comments/posts/${postId}`);
  return response.data;
};

// 댓글 작성
export const createComment = async (
  postId: number,
  content: string,
  token: string
): Promise<Comment> => {
  const response = await axios.post(
    `${API_URL}/comments/posts/${postId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// 댓글 수정
export const updateComment = async (
  commentId: number,
  content: string,
  token: string
): Promise<Comment> => {
  const response = await axios.put(
    `${API_URL}/comments/${commentId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (
  commentId: number,
  token: string
): Promise<void> => {
  await axios.delete(`${API_URL}/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};