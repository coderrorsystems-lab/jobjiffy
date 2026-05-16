import React, { useEffect, useState } from 'react';
import { fetchProfessionals, approveProfessional } from './services/adminAPI';
import { useNavigate } from 'react-router-dom';

export default function AdminProfessionals() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchProfessionals();
      setList(data.professionals || []);
      setError('');
    } catch (e) {
      console.error('AdminProfessionals fetch error:', e);
      const msg = e?.response?.data?.message || e?.message || 'Failed to load professionals';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try {
      await approveProfessional(id);
      setList((s) => s.map(p => p._id === id ? { ...p, status: 'approved' } : p));
    } catch (e) {
      setError(e?.response?.data?.message || 'Approve failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin — Professionals</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading ? <p>Loading…</p> : (
        <div className="space-y-3">
          {list.length === 0 && <p>No professionals found.</p>}
          {list.map(p => (
            <div key={p._id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{p.fullname} — {p.email}</div>
                <div className="text-sm text-slate-400">Status: {p.status}</div>
              </div>
              <div className="space-x-2">
                <button onClick={() => navigate(`/admin/professionals/${p._id}`)} className="px-3 py-1 bg-slate-700 rounded">View</button>
                {p.status !== 'approved' && (
                  <button onClick={() => handleApprove(p._id)} className="px-3 py-1 bg-cyan-600 rounded text-white">Approve</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
