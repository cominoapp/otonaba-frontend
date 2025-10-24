import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts } from '../api/posts';
import type { Post } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const categories = ['一般', '趣味', '健康', '旅行', '料理'];

  useEffect(() => {
    loadPosts();
  }, [category, currentPage, searchTerm]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts(
        category || undefined, 
        currentPage,
        searchTerm || undefined
      );
      setPosts(data.posts);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('投稿の読み込みに失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-logo">オトナバ</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
  <Link to="/" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600' }}>
    ホーム
  </Link>
  <Link to="/profile" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600' }}>
    プロフィール
  </Link>
  <NotificationBell />
  <span style={{ color: '#666' }}>{user?.nickname}さん</span>
  <button onClick={() => { logout(); navigate('/login'); }} className="btn-logout">
    ログアウト
  </button>
</div>
      </div>

      <div className="home-content">
        <div className="welcome-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>掲示板</h2>
            <Link to="/posts/write">
              <button className="btn-primary" style={{ width: 'auto', padding: '12px 24px' }}>
                新規投稿
              </button>
            </Link>
          </div>

          {/* 검색창 */}
          <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="🔍 タイトルまたは内容で検索..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                検索
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#e0e0e0',
                    color: '#666',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  クリア
                </button>
              )}
            </div>
            {searchTerm && (
              <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                検索結果: "{searchTerm}"
              </div>
            )}
          </form>

          {/* 카테고리 필터 */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleCategoryChange('')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: category === '' ? '#4a90e2' : '#e0e0e0',
                color: category === '' ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              全て
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: category === cat ? '#4a90e2' : '#e0e0e0',
                  color: category === cat ? 'white' : '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 게시글 목록 */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              読み込み中...
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              投稿がありません
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {posts.map(post => (
                  <Link
                    key={post.id}
                    to={`/posts/${post.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{
                      padding: '16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{post.title}</h3>
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: '#e8f4f8',
                          color: '#4a90e2',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {post.category}
                        </span>
                      </div>
                   <p style={{ color: '#666', fontSize: '14px', margin: '8px 0', lineHeight: '1.5' }}>
  {post.content.substring(0, 100)}...
</p>

{/* 썸네일 이미지 */}
{post.images && post.images.length > 0 && (
  <div style={{ marginTop: '12px' }}>
    <img
      src={post.images[0].image_url}
      alt="thumbnail"
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}
    />
  </div>
)}
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#999' }}>
                        <span>
                          👤 
                          <Link 
                            to={`/users/${post.author_nickname}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{ 
                              color: '#4a90e2', 
                              textDecoration: 'none',
                              fontWeight: '600'
                            }}
                          >
                            {post.author_nickname}
                          </Link>
                          {' '}({post.author_age_group})
                        </span>
                        <span>💬 {post.comment_count || 0}</span>
                        <span>❤️ {post.like_count || 0}</span>
                        <span>👁 {post.views}</span>
                        <span>📅 {formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '30px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
                      color: currentPage === 1 ? '#999' : '#333',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    ← 前へ
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: '8px 14px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        backgroundColor: currentPage === page ? '#4a90e2' : 'white',
                        color: currentPage === page ? 'white' : '#333',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        minWidth: '40px'
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
                      color: currentPage === totalPages ? '#999' : '#333',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    次へ →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;