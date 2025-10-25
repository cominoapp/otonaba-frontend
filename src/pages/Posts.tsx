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

  const categories = [
    '一般', '趣味', '健康', '旅行', 'グルメ',
    '日常', '雑談', '悩み', '自己紹介', '友達募集',
    'ペット', 'お金', '地元交流', '人生相談', '愚痴'
  ];

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
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-logo">
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            オトナバ
          </Link>
        </h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <>
              <Link to="/" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600', whiteSpace: 'nowrap' }}>
                ホーム
              </Link>
              <Link to="/profile" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600', whiteSpace: 'nowrap' }}>
                プロフィール
              </Link>
              <NotificationBell />
              <span style={{ color: '#666', whiteSpace: 'nowrap' }}>{user.nickname}さん</span>
              <button onClick={() => { logout(); navigate('/login'); }} className="btn-logout" style={{ whiteSpace: 'nowrap' }}>
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-primary" style={{ 
                padding: '8px 20px', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap'
              }}>
                会員登録
              </Link>
              <Link to="/login" className="btn-secondary" style={{ 
                padding: '8px 20px', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap'
              }}>
                ログイン
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="home-content">
        <div className="welcome-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>掲示板</h2>
            {user ? (
              <Link to="/posts/write">
                <button className="btn-primary" style={{ 
                  width: 'auto', 
                  padding: '12px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  新規投稿
                </button>
              </Link>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="btn-primary"
                style={{ 
                  width: 'auto', 
                  padding: '12px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                ログインして投稿
              </button>
            )}
          </div>

          {/* 検索フォーム */}
          <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="🔍 タイトルまたは内容で検索..."
                style={{
                  flex: 1,
                  minWidth: '200px',
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
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
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
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
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

          {/* カテゴリーフィルター */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginBottom: '20px', 
            flexWrap: 'wrap',
            justifyContent: 'flex-start'
          }}>
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
                fontWeight: '600',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'fit-content'
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
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 'fit-content'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 投稿リスト */}
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px', gap: '10px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '0' }}>
                          <span style={{ wordBreak: 'break-word' }}>{post.title}</span>
                          {post.images && post.images.length > 0 && (
                            <span style={{ fontSize: '16px', flexShrink: 0 }}>📷</span>
                          )}
                        </h3>
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: '#e8f4f8',
                          color: '#4a90e2',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}>
                          {post.category}
                        </span>
                      </div>
                      
                      <p style={{ color: '#666', fontSize: '14px', margin: '8px 0', lineHeight: '1.5', wordBreak: 'break-word' }}>
                        {post.content.substring(0, 100)}...
                      </p>
                      
                      <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#999', marginTop: '12px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{post.author_gender === '男性' ? '👨' : post.author_gender === '女性' ? '👩' : '👤'}</span>
                          <Link 
                            to={`/users/${post.author_nickname}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{ 
                              color: post.author_gender === '女性' ? '#FF3399' : '#4a90e2',
                              textDecoration: 'none',
                              fontWeight: '600',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {post.author_nickname}
                          </Link>
                          <span style={{ whiteSpace: 'nowrap' }}>
                            ({post.author_age_group}
                            {post.author_gender && `・${post.author_gender}`}
                            {post.author_region && `・${post.author_region}`})
                          </span>
                        </span>
                        <span style={{ whiteSpace: 'nowrap' }}>💬 {post.comment_count || 0}</span>
                        <span style={{ whiteSpace: 'nowrap' }}>❤️ {post.like_count || 0}</span>
                        <span style={{ whiteSpace: 'nowrap' }}>👁 {post.views}</span>
                        <span style={{ whiteSpace: 'nowrap' }}>📅 {formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* ページネーション */}
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
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
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
                        minWidth: '40px',
                        whiteSpace: 'nowrap'
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
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
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