import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react';
import { Input } from 'react';
import { Label } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { authAPI } from './api.js';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { user, token } = response.data;
      
      onLogin(user, token);
      navigate('/map');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: 'var(--pokemon-yellow)' }}>
              <MapPin className="w-7 h-7" style={{ color: 'var(--pokemon-black)' }} />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--pokemon-black)' }}>
              KritPokeMap
            </h1>
          </Link>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              style={{ 
                backgroundColor: 'var(--pokemon-yellow)', 
                color: 'var(--pokemon-black)' 
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold" style={{ color: 'var(--pokemon-blue)' }}>
                Register here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

