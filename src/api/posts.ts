import axios from 'axios';

const API_URL = 'https://otonaba-backend.onrender.com/api';

export interface Post {
  id: number;
  user_id: string;
  title: string;
  content: string;
  category: string;
  views: number;
  created_at: string;
  updated_at: string;
  author_nickname: string;
  author_age_group: string;
  author_gender: string;  
  author_region: string;  
  comment_count?: number;
  like_count?: number;
  images?: Array<{ id: number; image_url: string; cloudinary_id: string }>;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getPosts = async (
  category?: string, 
  page: number = 1, 
  search?: string
): Promise<PostsResponse> => {
  const params: any = { page, limit: 3 };
  if (category) params.category = category;
  if (search) params.search = search;
  
  const response = await axios.get(`${API_URL}/posts`, { params });
  return response.data;
};

export const getPost = async (id: number): Promise<Post> => {
  const response = await axios.get(`${API_URL}/posts/${id}`);
  return response.data;
};

export const createPost = async (
  title: string,
  content: string,
  category: string,
  images: Array<{ url: string; cloudinary_id: string }>,
  token: string
): Promise<Post> => {
  const response = await axios.post(
    `${API_URL}/posts`,
    { title, content, category, images },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updatePost = async (
  id: number,
  title: string,
  content: string,
  category: string,
  token: string
): Promise<Post> => {
  const response = await axios.put(
    `${API_URL}/posts/${id}`,
    { title, content, category },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deletePost = async (id: number, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};