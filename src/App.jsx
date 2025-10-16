import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import MapPage from './MapPage';
import AdminDashboard from './AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold" style={{ color: 'var(--pokemon-yellow)' }}>
          Loading KritPokeMap...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/map" /> : <LandingPage />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/map" /> : <LoginPage onLogin={handleLogin} />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/map" /> : <RegisterPage onLogin={handleLogin} />} 
        />
        <Route 
          path="/map" 
          element={user ? <MapPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={
            user && user.role === 'admin' 
              ? <AdminDashboard user={user} onLogout={handleLogout} /> 
              : <Navigate to="/map" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

