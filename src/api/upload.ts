import axios from 'axios';

const API_URL = 'https://otonaba-backend.onrender.com/api';

export interface UploadedImage {
  url: string;
  cloudinary_id: string;
}

// 이미지 업로드
export const uploadImage = async (file: File, token: string): Promise<UploadedImage> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

// 이미지 삭제
export const deleteImage = async (cloudinaryId: string, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/upload/${cloudinaryId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};