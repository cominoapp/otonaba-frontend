import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { sendMessage } from '../api/messages';
import { useAuth } from '../context/AuthContext';

const SendMessage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  // URL에서 받는 사람 정보 가져오기
  const receiverData = location.state as { receiverId: string; receiverNickname: string } | null;
  
  const [receiverId] = useState(receiverData?.receiverId || '');
  const [receiverNickname] = useState(receiverData?.receiverNickname || '');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!subject.trim() || !content.trim()) {
      setError('件名と内容を入力してください');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setSending(true);
      await sendMessage(receiverId, subject, content, token);
      alert('メッセージを送信しました');
      navigate('/profile');
    } catch (error: any) {
      setError(error.response?.data?.message || 'メッセージの送信に失敗しました');
    } finally {
      setSending(false);
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
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            メッセージを送る
          </h2>

          {receiverNickname && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#e8f4f8',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              宛先: <strong>{receiverNickname}</strong>
            </div>
          )}

          {error && (
            <div className="auth-error" style={{ marginBottom: '15px' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="input-label">件名</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="件名を入力してください"
                className="input-field"
                disabled={sending}
                maxLength={200}
              />
            </div>

            <div className="input-group">
              <label className="input-label">内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="メッセージ内容を入力してください"
                style={{
                  padding: '14px 12px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  outline: 'none',
                  minHeight: '200px',
                  width: '100%',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                disabled={sending}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 1 }}
                disabled={sending}
              >
                {sending ? '送信中...' : '送信する'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
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

export default SendMessage;