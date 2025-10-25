import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserByNickname, getUserPosts } from '../api/users';
import type { UserProfile, UserPosts } from '../api/users';
import { useAuth } from '../context/AuthContext';

const UserProfilePage: React.FC = () => {
  const { nickname } = useParams<{ nickname: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPosts[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, [nickname]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      if (!nickname) return;

      const profileData = await getUserByNickname(nickname);
      setProfile(profileData);

      const postsData = await getUserPosts(profileData.id);
      setPosts(postsData);
    } catch (error) {
      console.error('プロフィールの読み込みに失敗しました:', error);
      alert('ユーザーが見つかりません');
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!profile) return;
    navigate('/send-message', {
      state: {
        receiverId: profile.id,
        receiverNickname: profile.nickname
      }
    });
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

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-header">
          <h1 className="home-logo">オトナバ</h1>
        </div>
        <div className="home-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isOwnProfile = user?.id === profile.id;

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
          <Link to="/profile" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600' }}>
            プロフィール
          </Link>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn-logout">
            ログアウト
          </button>
        </div>
      </div>

      <div className="home-content">
        <div className="welcome-card">
          <div style={{ marginBottom: '20px' }}>
            <Link to="/posts" style={{ color: '#4a90e2', textDecoration: 'none', fontSize: '14px' }}>
              ← 掲示板に戻る
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '30px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>
                {profile.gender === '男性' ? '👨' : profile.gender === '女性' ? '👩' : '👤'}{' '}
                {profile.nickname}
              </h2>
              <div className="user-info">
                <div className="info-item">
                  <span className="info-label">年齢層:</span>
                  <span className="info-value">{profile.age_group}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">性別:</span>
                  <span className="info-value">{profile.gender || '未設定'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">地域:</span>
                  <span className="info-value">{profile.region || '未設定'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">登録日:</span>
                  <span className="info-value">{formatDate(profile.created_at)}</span>
                </div>
              </div>
            </div>

            {!isOwnProfile && (
              <button
                onClick={handleSendMessage}
                className="btn-primary"
                style={{ width: 'auto', padding: '12px 24px' }}
              >
                📨 メッセージを送る
              </button>
            )}
          </div>

          <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '30px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
              投稿一覧 ({posts.length})
            </h3>

            {posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                まだ投稿がありません
              </div>
            ) : (
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
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{post.title}</h3>
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: '#e8f4f8',
                          color: '#4a90e2',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {post.category}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#999' }}>
                        <span>💬 {post.comment_count}</span>
                        <span>❤️ {post.like_count}</span>
                        <span>👁 {post.views}</span>
                        <span>📅 {formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;