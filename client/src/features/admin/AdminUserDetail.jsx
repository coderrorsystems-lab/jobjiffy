import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser, blockUser, deleteUser, resetUserPassword } from './adminAPI';
import { ArrowLeft, Lock, Trash2, RotateCcw, AlertCircle } from 'lucide-react';

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const data = await fetchUser(id);
      setUser(data.user);
    } catch (e) {
      console.error('Error fetching user:', e);
      setError(e?.response?.data?.message || e?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async () => {
    setActionLoading(true);
    try {
      const newStatus = !user.isActive;
      const result = await blockUser(id, newStatus);
      setUser(result.user);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure? This will permanently delete this user account and cannot be undone.')) {
      return;
    }
    setActionLoading(true);
    try {
      await deleteUser(id);
      navigate('/admin/users');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete user');
      setActionLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!window.confirm('Send password reset email to ' + user?.email + '?')) {
      return;
    }
    setActionLoading(true);
    try {
      await resetUserPassword(id);
      alert('Password reset email sent to user');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to send password reset');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <button 
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4"
        >
          <ArrowLeft size={18} /> Back to Users
        </button>
        <div className="text-center py-12 text-red-400">{error || 'User not found'}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <button 
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6"
      >
        <ArrowLeft size={18} /> Back to Users
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm flex gap-2">
          <AlertCircle size={18} className="flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-2">
          <div className="border border-slate-700 rounded-lg p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-slate-400">{user.email}</p>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-medium ${
                user.isActive 
                  ? 'bg-green-900/20 text-green-400' 
                  : 'bg-red-900/20 text-red-400'
              }`}>
                {user.isActive ? 'Active' : 'Blocked'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-700">
              <div>
                <p className="text-sm text-slate-400">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Member Since</p>
                <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              {user.lastLogin && (
                <>
                  <div>
                    <p className="text-sm text-slate-400">Last Login</p>
                    <p className="font-medium">{new Date(user.lastLogin).toLocaleDateString()}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-slate-400">Email Verified</p>
                <p className="font-medium">{user.isEmailVerified ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {user.location && (
              <div className="mb-6 pb-6 border-b border-slate-700">
                <p className="text-sm text-slate-400 mb-2">Location</p>
                <div className="grid grid-cols-2 gap-4">
                  {user.location.street && <p>{user.location.street}</p>}
                  {user.location.city && <p>{user.location.city}</p>}
                  {user.location.state && <p>{user.location.state}</p>}
                  {user.location.pincode && <p>{user.location.pincode}</p>}
                </div>
              </div>
            )}

            {user.bio && (
              <div>
                <p className="text-sm text-slate-400 mb-2">Bio</p>
                <p className="text-slate-300">{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions Card */}
        <div className="border border-slate-700 rounded-lg p-6 h-fit">
          <h3 className="font-semibold mb-4">Admin Actions</h3>
          <div className="space-y-3">
            <button
              onClick={handleResetPassword}
              disabled={actionLoading}
              className="w-full flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Reset Password
            </button>

            <button
              onClick={handleBlockUser}
              disabled={actionLoading}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded text-sm font-medium ${
                user.isActive
                  ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400'
                  : 'bg-green-900/20 hover:bg-green-900/30 text-green-400'
              } disabled:opacity-50`}
            >
              <Lock size={16} />
              {user.isActive ? 'Block User' : 'Unblock User'}
            </button>

            <button
              onClick={handleDeleteUser}
              disabled={actionLoading}
              className="w-full flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/30 rounded text-sm font-medium text-red-400 disabled:opacity-50"
            >
              <Trash2 size={16} />
              Delete User
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">User ID</h4>
            <p className="text-xs text-slate-400 break-all font-mono">{user._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
