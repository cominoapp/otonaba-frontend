import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/write" element={<PostWrite />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/:id/edit" element={<PostWrite />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages/:id" element={<MessageDetailPage />} />
          <Route path="/send-message" element={<SendMessage />} />
          <Route path="/users/:nickname" element={<UserProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;