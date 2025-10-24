import axios from 'axios';

const API_URL = 'https://otonaba-backend.onrender.com/api';

export interface Notification {
  id: number;
  user_id: string;
  type: string;
  content: string;
  post_id: number | null;
  from_user_id: string;
  from_user_nickname: string;
  is_read: boolean;
  created_at: string;
}

// 알림 목록 조회
export const getNotifications = async (token: string): Promise<Notification[]> => {
  const response = await axios.get(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 안읽은 알림 개수
export const getUnreadCount = async (token: string): Promise<number> => {
  const response = await axios.get(`${API_URL}/notifications/unread/count`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.count;
};

// 알림 읽음 처리
export const markAsRead = async (id: number, token: string): Promise<void> => {
  await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// 모든 알림 읽음 처리
export const markAllAsRead = async (token: string): Promise<void> => {
  await axios.put(`${API_URL}/notifications/read-all`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// 알림 삭제
export const deleteNotification = async (id: number, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};