import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import PostWrite from './pages/PostWrite';
import Profile from './pages/Profile';
import MessageDetailPage from './pages/MessageDetail';
import SendMessage from './pages/SendMessage';
import UserProfilePage from './pages/UserProfile';

// PrivateRoute 컴포넌트 - 로그인 필요한 페이지 보호
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        読み込み中...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - 誰でもアクセス可能 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/users/:nickname" element={<UserProfilePage />} />

          {/* Private Routes - ログイン必須 */}
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/posts/write" element={<PrivateRoute><PostWrite /></PrivateRoute>} />
          <Route path="/posts/:id/edit" element={<PrivateRoute><PostWrite /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/messages/:id" element={<PrivateRoute><MessageDetailPage /></PrivateRoute>} />
          <Route path="/send-message" element={<PrivateRoute><SendMessage /></PrivateRoute>} />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/posts" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;