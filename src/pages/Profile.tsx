import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changePassword, updateProfile } from '../api/auth';
import { getPosts } from '../api/posts';
import { getInbox, getSentMessages } from '../api/messages';
import type { Post } from '../api/posts';
import type { Message } from '../api/messages';
import NotificationBell from '../components/NotificationBell';

type TabType = 'info' | 'posts' | 'messages';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [posts, setPosts] = useState<Post[]>([]);
  const [inboxMessages, setInboxMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [messageTab, setMessageTab] = useState<'inbox' | 'sent'>('inbox');
  
  // プロフィール編集
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [region, setRegion] = useState('');
  
  // パスワード変更
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const regions = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県', '海外'
  ];

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
      setAgeGroup(user.age_group);
      setGender(user.gender || '');
      setRegion(user.region || '');
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'posts') {
      loadMyPosts();
    } else if (activeTab === 'messages') {
      loadMessages();
    }
  }, [activeTab]);

const loadMyPosts = async () => {
  try {
    if (!user) return;
    const data = await getPosts();
    const myPosts = data.posts.filter((post: Post) => post.user_id === user.id);
    setPosts(myPosts);
  } catch (error) {
    console.error('投稿の読み込みに失敗しました:', error);
  }
};

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const inbox = await getInbox(token);
      const sent = await getSentMessages(token);
      setInboxMessages(inbox);
      setSentMessages(sent);
    } catch (error) {
      console.error('メッセージの読み込みに失敗しました:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname || !ageGroup || !gender || !region) {
      alert('全ての項目を入力してください');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const updatedUser = await updateProfile(nickname, ageGroup, gender, region, token);
      
      // ローカルストレージ更新
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('プロフィールを更新しました');
      setIsEditing(false);
      window.location.reload(); // Context 再読み込み
    } catch (error: any) {
      alert(error.response?.data?.message || 'プロフィール更新に失敗しました');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setPasswordError('全ての項目を入力してください');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setPasswordError('新しいパスワードが一致しません');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('パスワードは6文字以上で入力してください');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await changePassword(currentPassword, newPassword, token);
      
      setPasswordSuccess('パスワードを変更しました');
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'パスワード変更に失敗しました');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (!user) return null;

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-logo">
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            オトナバ
          </Link>
        </h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600' }}>
            ホーム
          </Link>
          <Link to="/posts" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600' }}>
            掲示板
          </Link>
          <NotificationBell />
          <span style={{ color: '#666' }}>{user.nickname}さん</span>
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

          {/* タブナビゲーション */}
          <div style={{
            display: 'flex',
            borderBottom: '2px solid #e0e0e0',
            marginBottom: '30px',
            gap: '20px'
          }}>
            <button
              onClick={() => setActiveTab('info')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                color: activeTab === 'info' ? '#4a90e2' : '#666',
                borderBottom: activeTab === 'info' ? '3px solid #4a90e2' : 'none',
                marginBottom: '-2px'
              }}
            >
              基本情報
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                color: activeTab === 'posts' ? '#4a90e2' : '#666',
                borderBottom: activeTab === 'posts' ? '3px solid #4a90e2' : 'none',
                marginBottom: '-2px'
              }}
            >
              投稿一覧 ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                color: activeTab === 'messages' ? '#4a90e2' : '#666',
                borderBottom: activeTab === 'messages' ? '3px solid #4a90e2' : 'none',
                marginBottom: '-2px'
              }}
            >
              メッセージ
            </button>
          </div>

          {/* 基本情報タブ */}
          {activeTab === 'info' && (
            <div>
              {!isEditing ? (
  <div>
    <div style={{ marginBottom: '30px' }}>
      <div style={{ marginBottom: '15px' }}>
        <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>メールアドレス:</div>
        <div style={{ fontSize: '16px' }}>{user.email}</div>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>ニックネーム:</div>
        <div style={{ fontSize: '16px' }}>{user.nickname}</div>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>年齢層:</div>
        <div style={{ fontSize: '16px' }}>{user.age_group}</div>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>性別:</div>
        <div style={{ fontSize: '16px' }}>{user.gender || '未設定'}</div>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>地域:</div>
        <div style={{ fontSize: '16px' }}>{user.region || '未設定'}</div>
      </div>
      {/* 信頼スコア 삭제됨 */}
    </div>

    <button
      onClick={() => setIsEditing(true)}
      className="btn-primary"
      style={{ width: 'auto', padding: '12px 32px', marginBottom: '30px' }}
    >
      プロフィールを編集
    </button>
  </div>
) : (
                <form onSubmit={handleProfileUpdate} style={{ marginBottom: '30px' }}>
                  <div className="input-group">
                    <label className="input-label">ニックネーム</label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="input-field"
                      maxLength={10}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">年齢層</label>
                    <select
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="input-field"
                    >
                      <option value="20代">20代</option>
                      <option value="30代">30代</option>
                      <option value="40代">40代</option>
                      <option value="50代">50代</option>
                      <option value="60代以上">60代以上</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">性別</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="input-field"
                    >
                      <option value="">選択してください</option>
                      <option value="男性">男性</option>
                      <option value="女性">女性</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">地域</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="input-field"
                    >
                      <option value="">選択してください</option>
                      {regions.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '12px 32px' }}>
                      保存する
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setNickname(user.nickname);
                        setAgeGroup(user.age_group);
                        setGender(user.gender || '');
                        setRegion(user.region || '');
                      }}
                      style={{
                        padding: '12px 32px',
                        backgroundColor: '#e0e0e0',
                        color: '#666',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      キャンセル
                    </button>
                  </div>
                </form>
              )}

              {/* パスワード変更 */}
              <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '30px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
                  パスワード変更
                </h3>

                {passwordError && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#fee',
                    color: '#c33',
                    borderRadius: '6px',
                    marginBottom: '15px'
                  }}>
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#efe',
                    color: '#3c3',
                    borderRadius: '6px',
                    marginBottom: '15px'
                  }}>
                    {passwordSuccess}
                  </div>
                )}

                <form onSubmit={handlePasswordChange}>
                  <div className="input-group">
                    <label className="input-label">現在のパスワード</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">新しいパスワード</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">新しいパスワード（確認）</label>
                    <input
                      type="password"
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '12px 32px' }}>
                    変更する
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 投稿一覧タブ */}
          {activeTab === 'posts' && (
            <div>
              {posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
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
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{post.title}</h3>
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
                        <p style={{ color: '#666', fontSize: '14px', margin: '8px 0' }}>
                          {post.content.substring(0, 100)}...
                        </p>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#999' }}>
                          <span>💬 {post.comment_count || 0}</span>
                          <span>❤️ {post.like_count || 0}</span>
                          <span>👁 {post.views}</span>
                          <span>📅 {formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* メッセージタブ */}
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
                    fontWeight: '600'
                  }}
                >
                  受信 ({inboxMessages.length})
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
                  送信 ({sentMessages.length})
                </button>
              </div>

              {messageTab === 'inbox' && (
                <div>
                  {inboxMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      受信メッセージがありません
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {inboxMessages.map(msg => (
                        <Link
                          key={msg.id}
                          to={`/messages/${msg.id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <div style={{
                            padding: '16px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            backgroundColor: msg.is_read ? 'white' : '#f0f8ff',
                            cursor: 'pointer'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{msg.subject}</span>
                              {!msg.is_read && (
                                <span style={{
                                  padding: '2px 8px',
                                  backgroundColor: '#4a90e2',
                                  color: 'white',
                                  borderRadius: '10px',
                                  fontSize: '12px'
                                }}>
                                  未読
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666' }}>
                              From: {msg.sender_nickname} ({msg.sender_age_group})
                            </div>
                            <div style={{ fontSize: '13px', color: '#999', marginTop: '5px' }}>
                              {formatDate(msg.created_at)}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {messageTab === 'sent' && (
                <div>
                  {sentMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      送信メッセージがありません
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {sentMessages.map(msg => (
                        <Link
                          key={msg.id}
                          to={`/messages/${msg.id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <div style={{
                            padding: '16px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                          }}>
                            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
                              {msg.subject}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666' }}>
                              To: {msg.receiver_nickname} ({msg.receiver_age_group})
                            </div>
                            <div style={{ fontSize: '13px', color: '#999', marginTop: '5px' }}>
                              {formatDate(msg.created_at)}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;