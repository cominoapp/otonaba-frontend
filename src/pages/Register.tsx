import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [region, setRegion] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !passwordConfirm || !nickname || !ageGroup || !gender || !region) {
      setError('全ての項目を入力してください');
      return;
    }

    if (password !== passwordConfirm) {
      setError('パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, nickname, ageGroup, gender, region);
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
            <label className="input-label">ニックネーム (10文字以内)</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="jun"
              className="input-field"
              maxLength={10}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">年齢層</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="input-field"
              disabled={loading}
            >
              <option value="">選択してください</option>
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
              disabled={loading}
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
              disabled={loading}
            >
              <option value="">選択してください</option>
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
              placeholder="••••••••"
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