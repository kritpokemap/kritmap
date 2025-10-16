import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react';
import { MapPin, LogOut, Users, MessageCircle, MapPinned, TrendingUp } from 'lucide-react';
import { adminAPI } from './api.js';

export default function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
      ]);
      
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    
    try {
      await adminAPI.suspendUser(userId);
      fetchData();
      alert('User suspended successfully');
    } catch (error) {
      alert('Failed to suspend user');
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await adminAPI.activateUser(userId);
      fetchData();
      alert('User activated successfully');
    } catch (error) {
      alert('Failed to activate user');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: 'var(--pokemon-yellow)' }}>
              <MapPin className="w-6 h-6" style={{ color: 'var(--pokemon-black)' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-xs text-gray-600">KritPokeMap</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/map">
              <Button variant="outline">Back to Map</Button>
            </Link>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8" style={{ color: 'var(--pokemon-blue)' }} />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{stats?.total_users || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8" style={{ color: 'var(--pokemon-yellow)' }} />
              <div>
                <p className="text-sm text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold">{stats?.total_subscriptions || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <MapPinned className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Sightings</p>
                <p className="text-2xl font-bold">{stats?.active_sightings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold">{stats?.total_messages || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 text-sm">{u.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{u.username}</td>
                    <td className="px-6 py-4 text-sm">{u.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {u.role !== 'admin' && (
                        <div className="flex gap-2">
                          {u.is_active ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSuspendUser(u.id)}
                            >
                              Suspend
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleActivateUser(u.id)}
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

