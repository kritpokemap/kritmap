import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react';
import { Input } from 'react';
import { Label } from 'react';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { authAPI } from './api.js';

export default function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      const { user, token } = response.data;
      
      onLogin(user, token);
      navigate('/map');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 py-8">
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

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-2 text-center">Create Your Account</h2>
          <p className="text-center text-gray-600 mb-6">
            Start your 7-day free trial
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span>7-day free trial included!</span>
          </div>

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
                placeholder="Choose a username"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
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
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
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
              {loading ? 'Creating Account...' : 'Start Free Trial'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold" style={{ color: 'var(--pokemon-blue)' }}>
                Login here
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

