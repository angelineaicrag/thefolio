import { Routes, Route, Navigate } from 'react-router-dom';  // Remove BrowserRouter from this import
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import PostPage from './pages/PostPage';
import AdminPage from './pages/AdminPage';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  if (showSplash) {
    return <SplashPage />;
  }

  return (
    <>
      <AuthProvider>
        <Nav toggleDarkMode={toggleDarkMode} />
        <main className="main-content">
          <Routes>
            {/* Phase 1 Routes */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Phase 2 Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/create-post" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;