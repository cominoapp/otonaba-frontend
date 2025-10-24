import NotificationBell from '../components/NotificationBell';
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="home-header">
  <h1 className="home-logo">オトナバ</h1>
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <Link to="/posts" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600' }}>
      掲示板
    </Link>
    <Link to="/profile" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600' }}>
      プロフィール
    </Link>
    <NotificationBell />
    <button onClick={handleLogout} className="btn-logout">
      ログアウト
    </button>
  </div>
</div>

      <div className="home-content">
        <div className="welcome-card">
          <h2 className="welcome-title">ようこそ、{user?.nickname}さん！ 🎉</h2>
          <p className="welcome-text">
            大人のサードプレイスへようこそ。
          </p>
          
          <div className="user-info">
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
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3 className="feature-title">掲示板</h3>
            <p className="feature-text">
              似た関心を持つ人々と話をしてみましょう
            </p>
            <Link to="/posts" style={{ textDecoration: 'none', width: '100%' }}>
              <button className="btn-primary" style={{ width: '100%' }}>
                掲示板を見る
              </button>
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">サークル</h3>
            <p className="feature-text">
              趣味や関心を共有する小規模コミュニティに参加しましょう
            </p>
            <button className="btn-feature">近日公開予定</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3 className="feature-title">イベント</h3>
            <p className="feature-text">
              オンライン・オフラインの集まりやイベントに参加しましょう
            </p>
            <button className="btn-feature">近日公開予定</button>
          </div>
        </div>

        <div className="status-card">
          <h3 className="status-title">🚀 開発進捗状況</h3>
          <div className="status-list">
            <div className="status-item">
              <span className="status-check">✅</span>
              <span>会員登録およびログイン機能</span>
            </div>
            <div className="status-item">
              <span className="status-check">✅</span>
              <span>データベース接続</span>
            </div>
            <div className="status-item">
              <span className="status-check">✅</span>
              <span>掲示板機能</span>
            </div>
            <div className="status-item">
              <span className="status-check">⏳</span>
              <span>サークル機能（開発予定）</span>
            </div>
            <div className="status-item">
              <span className="status-check">⏳</span>
              <span>イベント機能（開発予定）</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;