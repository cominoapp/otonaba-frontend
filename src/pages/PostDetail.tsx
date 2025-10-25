import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, deletePost } from '../api/posts';
import type { Post } from '../api/posts';
import { getComments, createComment, deleteComment } from '../api/comments';
import type { Comment } from '../api/comments';
import { checkLike, toggleLike } from '../api/likes';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';
// 👈 SEO import 추가
import SEO from '../components/SEO'; 

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPost();
    loadComments();
    checkUserLike();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await getPost(Number(id));
      setPost(data);
      setLikeCount(data.like_count || 0);
    } catch (error) {
      console.error('投稿の読み込みに失敗しました:', error);
      alert('投稿が見つかりません');
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await getComments(Number(id));
      setComments(data);
    } catch (error) {
      console.error('コメントの読み込みに失敗しました:', error);
    }
  };

  const checkUserLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const data = await checkLike(Number(id), token);
      setIsLiked(data.isLiked);
    } catch (error) {
      console.error('いいね確認に失敗しました:', error);
    }
  };

  const handleToggleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('ログインが必要です');
      navigate('/login');
      return;
    }

    try {
      const result = await toggleLike(Number(id), token);
      setIsLiked(result.isLiked);
      setLikeCount(result.likeCount);
    } catch (error: any) {
      alert(error.response?.data?.message || 'いいねに失敗しました');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('本当に削除しますか？')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      await deletePost(Number(id), token);
      alert('削除しました');
      navigate('/posts');
    } catch (error: any) {
      alert(error.response?.data?.message || '削除に失敗しました');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      alert('コメントを入力してください');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('ログインが必要です');
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      const comment = await createComment(Number(id), newComment, token);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'コメントの投稿に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('コメントを削除しますか？')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await deleteComment(commentId, token);
      setComments(comments.filter(c => c.id !== commentId));
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

  if (!post) return null;

  const isAuthor = user?.id === post.user_id;

  return (
    // 👈 최상위 JSX 요소에 SEO 컴포넌트와 post 내용 삽입
    <>
      {post && (
        <SEO 
          title={`${post.title} - オトナバ掲示板`}
          description={post.content.substring(0, 150)}
          keywords={`${post.category},掲示板,オトナバ,${post.author_age_group}`}
          url={`https://otonaba.vercel.app/posts/${post.id}`}
          type="article"
          ogImage={post.images && post.images.length > 0 ? post.images[0].image_url : undefined}
        />
      )}
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
            <NotificationBell />
            <button onClick={() => { logout(); navigate('/login'); }} className="btn-logout">
              ログアウト
            </button>
          </div>
        </div>

        <div className="home-content">
          {/* 게시글 내용 */}
          <div className="welcome-card">
            <div style={{ marginBottom: '20px' }}>
              <Link to="/posts" style={{ color: '#4a90e2', textDecoration: 'none', fontSize: '14px' }}>
                ← 掲示板に戻る
              </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>{post.title}</h1>
                <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#666', flexWrap: 'wrap' }}>
                  <span>
                    {post.author_gender === '男性' ? '👨' : post.author_gender === '女性' ? '👩' : '👤'}{' '}
                    <Link 
                      to={`/users/${post.author_nickname}`}
                      style={{ 
                        color: '#4a90e2', 
                        textDecoration: 'none',
                        fontWeight: '600'
                      }}
                    >
                      {post.author_nickname}
                    </Link>
                    {' '}({post.author_age_group}
                    {post.author_gender && `・${post.author_gender}`}
                    {post.author_region && `・${post.author_region}`})
                  </span>
                  <span>📁 {post.category}</span>
                  <span>👁 {post.views}</span>
                  <span>📅 {formatDate(post.created_at)}</span>
                </div>
              </div>
              {isAuthor && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => navigate(`/posts/${post.id}/edit`)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4a90e2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    編集
                  </button>
                  <button
                    onClick={handleDeletePost}
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
                </div>
              )}
            </div>

            <div style={{
              padding: '24px 0',
              borderTop: '1px solid #e0e0e0',
              borderBottom: '1px solid #e0e0e0',
              lineHeight: '1.8',
              fontSize: '16px',
              whiteSpace: 'pre-wrap'
            }}>
              {post.content}
            </div>

            {/* 이미지 표시 */}
            {post.images && post.images.length > 0 && (
              <div style={{ padding: '24px 0' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: post.images.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px'
                }}>
                  {post.images.map((image: any, index: number) => (
                    <div key={index} style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                      <img
                        src={image.image_url}
                        alt={`post-image-${index}`}
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '500px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          transition: 'transform 0.3s'
                        }}
                        onClick={() => window.open(image.image_url, '_blank')}
                        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 좋아요 버튼 */}
            <div style={{ paddingTop: '20px', textAlign: 'center' }}>
              <button
                onClick={handleToggleLike}
                style={{
                  padding: '12px 32px',
                  fontSize: '16px',
                  backgroundColor: isLiked ? '#ff6b9d' : '#f0f0f0',
                  color: isLiked ? 'white' : '#666',
                  border: isLiked ? '2px solid #ff6b9d' : '2px solid #ddd',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                  boxShadow: isLiked ? '0 4px 12px rgba(255, 107, 157, 0.3)' : 'none'
                }}
              >
                {isLiked ? '♥' : '♡'} いいね {likeCount}
              </button>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div className="welcome-card" style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
              💬 コメント ({comments.length})
            </h3>

            {/* 댓글 작성 폼 */}
            <form onSubmit={handleSubmitComment} style={{ marginBottom: '30px' }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを入力してください..."
                style={{
                  width: '100%',
                  minHeight: '100px',
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
                style={{ width: 'auto', padding: '10px 24px', marginTop: '10px' }}
                disabled={submitting}
              >
                {submitting ? '投稿中...' : 'コメントする'}
              </button>
            </form>

            {/* 댓글 목록 */}
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                まだコメントがありません
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {comments.map(comment => {
                  const isCommentAuthor = user?.id === comment.user_id;
                  return (
                    <div key={comment.id} style={{
                      padding: '16px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {comment.author_gender === '男性' ? '👨' : comment.author_gender === '女性' ? '👩' : '👤'}{' '}
                          <Link 
                            to={`/users/${comment.author_nickname}`}
                            style={{ 
                              fontWeight: '600', 
                              color: '#4a90e2',
                              textDecoration: 'none'
                            }}
                          >
                            {comment.author_nickname}
                          </Link>
                          {' '}({comment.author_age_group}
                          {comment.author_gender && `・${comment.author_gender}`}
                          {comment.author_region && `・${comment.author_region}`})
                          <span style={{ marginLeft: '12px', color: '#999' }}>
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        {isCommentAuthor && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            style={{
                              padding: '4px 12px',
                              backgroundColor: '#ff4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            削除
                          </button>
                        )}
                      </div>
                      <p style={{ fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: 0 }}>
                        {comment.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetail;