import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPosts } from '../api/users';
import type { UserPosts } from '../api/users';
import { getInbox, getSentMessages, getUnreadCount } from '../api/messages';
import type { Message } from '../api/messages';
import { changePassword } from '../api/users';
import NotificationBell from '../components/NotificationBell';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'info' | 'posts' | 'messages'>('info');
  const [posts, setPosts] = useState<UserPosts[]>([]);
  const [inbox, setInbox] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messageTab, setMessageTab] = useState<'inbox' | 'sent'>('inbox');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (activeTab === 'posts') loadPosts();
    if (activeTab === 'messages') loadMessages();
  }, [activeTab, messageTab]);

  const loadPosts = async () => {
    try {
      if (user) {
        const data = await getUserPosts(user.id);
        setPosts(data);
      }
    } catch (error) {
      console.error('投稿の読み込みに失敗しました:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (messageTab === 'inbox') {
        const data = await getInbox(token);
        setInbox(data);
        const count = await getUnreadCount(token);
        setUnreadCount(count);
      } else {
        const data = await getSentMessages(token);
        setSentMessages(data);
      }
    } catch (error) {
      console.error('メッセージの読み込みに失敗しました:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('新しいパスワードが一致しません');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('パスワードは6文字以上にしてください');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await changePassword(currentPassword, newPassword, token);
      setPasswordSuccess('パスワードが変更されました');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'パスワード変更に失敗しました');
    }
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
            マイプロフィール
          </h2>

          {/* 탭 메뉴 */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' }}>
            <button
              onClick={() => setActiveTab('info')}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderBottom: activeTab === 'info' ? '3px solid #4a90e2' : 'none',
                backgroundColor: 'transparent',
                color: activeTab === 'info' ? '#4a90e2' : '#666',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              基本情報
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderBottom: activeTab === 'posts' ? '3px solid #4a90e2' : 'none',
                backgroundColor: 'transparent',
                color: activeTab === 'posts' ? '#4a90e2' : '#666',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              投稿一覧 ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderBottom: activeTab === 'messages' ? '3px solid #4a90e2' : 'none',
                backgroundColor: 'transparent',
                color: activeTab === 'messages' ? '#4a90e2' : '#666',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                position: 'relative'
              }}
            >
              メッセージ
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* 기본 정보 탭 */}
          {activeTab === 'info' && (
            <div>
              <div className="user-info" style={{ marginBottom: '30px' }}>
                <div className="info-item">
                  <span className="info-label">メールアドレス:</span>
                  <span className="info-value">{user?.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">ニックネーム:</span>
                  <span className="info-value">{user?.nickname}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">年齢層:</span>
                  <span className="info-value">{user?.age_group}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">信頼スコア:</span>
                  <span className="info-value">{user?.trust_score}点</span>
                </div>
              </div>

              {/* 비밀번호 변경 */}
              <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
                  パスワード変更
                </h3>

                {passwordError && (
                  <div className="auth-error" style={{ marginBottom: '15px' }}>{passwordError}</div>
                )}
                {passwordSuccess && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    borderRadius: '6px',
                    marginBottom: '15px',
                    fontSize: '14px'
                  }}>
                    {passwordSuccess}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="auth-form">
                  <div className="input-group">
                    <label className="input-label">現在のパスワード</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="input-field"
                        style={{ paddingRight: '45px' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '20px',
                          padding: '5px',
						  outline: 'none'
						  
                        }}
                      >
                        {showCurrentPassword ? '👁️' : '🚫️'}
                      </button>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">新しいパスワード</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-field"
                        style={{ paddingRight: '45px' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '20px',
                          padding: '5px',
						  outline: 'none'

                        }}
                      >
                        {showNewPassword ? '👁️' : '🚫️'}
                      </button>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">新しいパスワード（確認）</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field"
                        style={{ paddingRight: '45px' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '20px',
                          padding: '5px',
						  outline: 'none'
                        }}
                      >
                        {showConfirmPassword ? '👁️' : '🚫️'}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '12px 32px' }}>
                    変更する
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 투고 목록 탭 */}
          {activeTab === 'posts' && (
            <div>
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
                        cursor: 'pointer'
                      }}>
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
                          <span>Comment {post.comment_count}</span>
                          <span>Like {post.like_count}</span>
                          <span>View {post.views}</span>
                          <span>Date {formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 메시지 탭 */}
          {activeTab === 'messages' && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                  onClick={() => setMessageTab('inbox')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: messageTab === 'inbox' ? '#4a90e2' : '#e0e0e0',
                    color: messageTab === 'inbox' ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    position: 'relative'
                  }}
                >
                  受信箱
                  {unreadCount > 0 && messageTab === 'inbox' && (
                    <span style={{
                      marginLeft: '8px',
                      backgroundColor: '#ff4444',
                      color: 'white',
                      borderRadius: '10px',
                      padding: '2px 8px',
                      fontSize: '11px'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setMessageTab('sent')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: messageTab === 'sent' ? '#4a90e2' : '#e0e0e0',
                    color: messageTab === 'sent' ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  送信済み
                </button>
              </div>

              {messageTab === 'inbox' ? (
                inbox.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    メッセージがありません
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {inbox.map(message => (
                      <Link
                        key={message.id}
                        to={`/messages/${message.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <div style={{
                          padding: '16px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          backgroundColor: message.is_read ? 'white' : '#f0f8ff',
                          cursor: 'pointer'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                            <div>
                              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                                {!message.is_read && <span style={{ color: '#4a90e2', marginRight: '8px' }}>●</span>}
                                {message.subject}
                              </h3>
                              <p style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}>
                                From: {message.sender_nickname} ({message.sender_age_group})
                              </p>
                            </div>
                            <span style={{ fontSize: '12px', color: '#999' }}>
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                            {message.content.substring(0, 80)}...
                          </p>
                          {(message.reply_count || 0) > 0 && (
                            <div style={{ marginTop: '8px', fontSize: '13px', color: '#4a90e2' }}>
                              Reply {message.reply_count}件
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              ) : (
                sentMessages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    送信したメッセージがありません
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sentMessages.map(message => (
                      <Link
                        key={message.id}
                        to={`/messages/${message.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <div style={{
                          padding: '16px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          cursor: 'pointer'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                            <div>
                              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                                {message.subject}
                              </h3>
                              <p style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}>
                                To: {message.receiver_nickname} ({message.receiver_age_group})
                              </p>
                            </div>
                            <span style={{ fontSize: '12px', color: '#999' }}>
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                            {message.content.substring(0, 80)}...
                          </p>
                          {(message.reply_count || 0) > 0 && (
                            <div style={{ marginTop: '8px', fontSize: '13px', color: '#4a90e2' }}>
                              Reply {message.reply_count}件
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;