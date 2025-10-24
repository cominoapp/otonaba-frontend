import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMessage, replyToMessage, deleteMessage } from '../api/messages';
import type { MessageDetail } from '../api/messages';
import { useAuth } from '../context/AuthContext';

const MessageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState<MessageDetail | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadMessage();
  }, [id]);

  const loadMessage = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const data = await getMessage(Number(id), token);
      setMessage(data);
    } catch (error: any) {
      console.error('メッセージの読み込みに失敗しました:', error);
      alert(error.response?.data?.message || 'メッセージが見つかりません');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      alert('返信内容を入力してください');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setSubmitting(true);
      const newReply = await replyToMessage(Number(id), replyContent, token);
      
      if (message) {
        setMessage({
          ...message,
          replies: [...message.replies, newReply]
        });
      }
      
      setReplyContent('');
    } catch (error: any) {
      alert(error.response?.data?.message || '返信に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('メッセージを削除しますか？')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await deleteMessage(Number(id), token);
      alert('削除しました');
      navigate('/profile');
    } catch (error: any) {
      alert(error.response?.data?.message || '削除に失敗しました');
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

  if (!message) return null;

  const isReceiver = user?.id === message.receiver_id;
  // const isSender = user?.id === message.sender_id;

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
            <Link to="/profile" style={{ color: '#4a90e2', textDecoration: 'none', fontSize: '14px' }}>
              ← プロフィールに戻る
            </Link>
          </div>

          {/* 메시지 헤더 */}
          <div style={{ borderBottom: '2px solid #e0e0e0', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                {message.subject}
              </h1>
              {isReceiver && (
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  削除
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666' }}>
              <span>From: <strong>{message.sender_nickname}</strong> ({message.sender_age_group})</span>
              <span>To: <strong>{message.receiver_nickname}</strong> ({message.receiver_age_group})</span>
              <span>📅 {formatDate(message.created_at)}</span>
            </div>
          </div>

          {/* 메시지 내용 */}
          <div style={{
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            marginBottom: '30px',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap'
          }}>
            {message.content}
          </div>

          {/* 답글 목록 */}
          {message.replies.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                💬 返信 ({message.replies.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {message.replies.map(reply => (
                  <div key={reply.id} style={{
                    padding: '16px',
                    backgroundColor: reply.user_id === user?.id ? '#e8f4f8' : '#f9f9f9',
                    borderRadius: '8px',
                    borderLeft: reply.user_id === user?.id ? '4px solid #4a90e2' : '4px solid #ddd'
                  }}>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                      <strong>{reply.nickname}</strong> ({reply.age_group})
                      <span style={{ marginLeft: '12px' }}>{formatDate(reply.created_at)}</span>
                    </div>
                    <p style={{ fontSize: '15px', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 답글 작성 폼 */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
              返信する
            </h3>
            <form onSubmit={handleReply}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="返信内容を入力してください..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                disabled={submitting}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ width: 'auto', padding: '12px 32px', marginTop: '10px' }}
                disabled={submitting}
              >
                {submitting ? '送信中...' : '返信する'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailPage;