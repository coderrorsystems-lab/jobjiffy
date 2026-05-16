import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, blockUser, deleteUser } from './services/adminAPI';
import { Trash2, Lock, Unlock, Eye } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data.users || []);
    } catch (e) {
      console.error('Error fetching users:', e);
      setError(e?.response?.data?.message || e?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await blockUser(userId, newStatus);
      setUsers(users.map(u => 
        u._id === userId ? { ...u, isActive: newStatus } : u
      ));
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button 
          onClick={loadUsers}
          className="px-4 py-2 bg-slate-700 rounded text-sm hover:bg-slate-600"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-slate-400">No users found</div>
      ) : (
        <div className="overflow-x-auto border border-slate-700 rounded-lg">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b border-slate-700 hover:bg-slate-800/50">
                  <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{user.phone}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-900/20 text-green-400' 
                        : 'bg-red-900/20 text-red-400'
                    }`}>
                      {user.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/admin/users/${user._id}`)}
                      className="p-2 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                      title="View details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleBlockToggle(user._id, user.isActive)}
                      className={`p-2 rounded ${
                        user.isActive 
                          ? 'hover:bg-red-900/30 text-red-400' 
                          : 'hover:bg-green-900/30 text-green-400'
                      }`}
                      title={user.isActive ? 'Block user' : 'Unblock user'}
                    >
                      {user.isActive ? <Lock size={18} /> : <Unlock size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="p-2 hover:bg-red-900/30 rounded text-red-400"
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
