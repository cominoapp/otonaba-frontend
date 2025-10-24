import axios from 'axios';

const API_URL = 'https://otonaba-backend.onrender.com/api';

export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_nickname?: string;
  sender_age_group?: string;
  receiver_nickname?: string;
  receiver_age_group?: string;
  reply_count?: number;
}

export interface MessageReply {
  id: number;
  message_id: number;
  user_id: string;
  content: string;
  created_at: string;
  nickname: string;
  age_group: string;
}

export interface MessageDetail extends Message {
  replies: MessageReply[];
}

// 받은 메시지 목록
export const getInbox = async (token: string): Promise<Message[]> => {
  const response = await axios.get(`${API_URL}/messages/inbox`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 보낸 메시지 목록
export const getSentMessages = async (token: string): Promise<Message[]> => {
  const response = await axios.get(`${API_URL}/messages/sent`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 메시지 상세 조회
export const getMessage = async (id: number, token: string): Promise<MessageDetail> => {
  const response = await axios.get(`${API_URL}/messages/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// 메시지 보내기
export const sendMessage = async (
  receiverId: string,
  subject: string,
  content: string,
  token: string
): Promise<Message> => {
  const response = await axios.post(
    `${API_URL}/messages`,
    { receiver_id: receiverId, subject, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// 답글 작성
export const replyToMessage = async (
  messageId: number,
  content: string,
  token: string
): Promise<MessageReply> => {
  const response = await axios.post(
    `${API_URL}/messages/${messageId}/reply`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// 메시지 삭제
export const deleteMessage = async (id: number, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/messages/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// 안읽은 메시지 개수
export const getUnreadCount = async (token: string): Promise<number> => {
  const response = await axios.get(`${API_URL}/messages/unread/count`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.count;
};