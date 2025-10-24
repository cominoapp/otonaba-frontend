import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createPost, getPost, updatePost } from '../api/posts';
import { uploadImage, deleteImage } from '../api/upload';
import type { UploadedImage } from '../api/upload';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';

const PostWrite: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('一般');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const categories = ['一般', '趣味', '健康', '旅行', '料理'];

  useEffect(() => {
    if (isEdit) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const data = await getPost(Number(id));
      
      if (data.user_id !== user?.id) {
        alert('権限がありません');
        navigate('/posts');
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category);
      if (data.images) {
  setImages(data.images.map(img => ({
    url: img.image_url,
    cloudinary_id: img.cloudinary_id
  })));
}
    } catch (error) {
      console.error('投稿の読み込みに失敗しました:', error);
      alert('投稿が見つかりません');
      navigate('/posts');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('ログインが必要です');
      navigate('/login');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file, token));
      const uploadedImages = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedImages]);
    } catch (error: any) {
      setError(error.response?.data?.message || '画像のアップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = images[index];
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await deleteImage(imageToRemove.cloudinary_id, token);
      setImages(images.filter((_, i) => i !== index));
    } catch (error) {
      console.error('画像の削除に失敗しました:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('タイトルと内容を入力してください');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await updatePost(Number(id), title, content, category, token);
        alert('更新しました');
      } else {
        await createPost(title, content, category, images, token);
        alert('投稿しました');
      }

      navigate('/posts');
    } catch (error: any) {
      setError(error.response?.data?.message || '投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-logo">オトナバ</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
  <Link to="/" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600' }}>
    ホーム
  </Link>
  <Link to="/posts" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600' }}>
    掲示板
  </Link>
  <NotificationBell />
  <button onClick={() => { logout(); navigate('/login'); }} className="btn-logout">
    ログアウト
  </button>
</div>
      </div>

      <div className="home-content">
        <div className="welcome-card">
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            {isEdit ? '投稿を編集' : '新規投稿'}
          </h2>

          {error && (
            <div className="auth-error" style={{ marginBottom: '15px' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="input-label">カテゴリー</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
                style={{ cursor: 'pointer' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="タイトルを入力してください"
                className="input-field"
                maxLength={200}
              />
            </div>

            <div className="input-group">
              <label className="input-label">内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="内容を入力してください"
                style={{
                  padding: '14px 12px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  outline: 'none',
                  minHeight: '300px',
                  width: '100%',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* 이미지 업로드 */}
            <div className="input-group">
              <label className="input-label">画像 (最大5枚)</label>
              
              {/* 이미지 미리보기 */}
              {images.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  {images.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={image.url}
                        alt={`upload-${index}`}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          backgroundColor: '#ff4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 업로드 버튼 */}
              {images.length < 5 && (
                <div>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-upload"
                    style={{
                      display: 'inline-block',
                      padding: '12px 24px',
                      backgroundColor: uploading ? '#ccc' : '#4a90e2',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    {uploading ? 'アップロード中...' : '📷 画像を追加'}
                  </label>
                  <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                    JPG, PNG, GIF (最大5MB)
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || uploading}
                style={{ flex: 1 }}
              >
                {loading ? '投稿中...' : isEdit ? '更新する' : '投稿する'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/posts')}
                style={{
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#666',
                  backgroundColor: '#e0e0e0',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostWrite;