import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [ageGroup, setAgeGroup] = useState('30代');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !nickname) {
      setError('全ての項目を入力してください');
      return;
    }

    if (password !== passwordConfirm) {
      setError('パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上である必要があります');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, nickname, ageGroup);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">オトナバ 新規登録</h1>
        <p className="auth-subtitle">大人のサードプレイスへようこそ</p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="input-field"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">ニックネーム <span className="input-info">(10文字以内)</span></label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="ニックネームを入力してください"
              className="input-field"
              disabled={loading}
			  maxLength={10}
            />
          </div>

          <div className="input-group">
            <label className="input-label">年齢層</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="select-field"
              disabled={loading}
            >
              <option value="30代" className="select-option">30代</option>
              <option value="40代" className="select-option">40代</option>
              <option value="50代" className="select-option">50代</option>
              <option value="60代" className="select-option">60代</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6文字以上"
              className="input-field"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">パスワード確認</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="パスワードを再入力してください"
              className="input-field"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? '登録中...' : '新規登録'}
          </button>
        </form>

        <p className="auth-footer">
          既にアカウントをお持ちの方は{' '}
          <Link to="/login" className="auth-link">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;