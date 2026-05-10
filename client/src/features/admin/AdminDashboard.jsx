import React, { useEffect, useState } from 'react';
import { fetchProfessionals } from './adminAPI';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ professionals: 0, users: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchProfessionals();
        const list = data.professionals || [];
        setCounts({ professionals: list.length, users: 0 });
        setRecent(list.slice(0, 6));
      } catch (e) {
        console.error('AdminDashboard fetch error:', e);
        const msg = e?.response?.data?.message || e?.message || 'Failed to load professionals';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div 
          onClick={() => navigate('/admin/professionals')}
          className="p-4 border rounded cursor-pointer hover:border-cyan-500 hover:bg-slate-800/50 transition"
        >
          <div className="text-sm text-slate-500">Professionals</div>
          <div className="text-3xl font-semibold">{counts.professionals}</div>
        </div>
        <div 
          onClick={() => navigate('/admin/users')}
          className="p-4 border rounded cursor-pointer hover:border-cyan-500 hover:bg-slate-800/50 transition"
        >
          <div className="text-sm text-slate-500">Users</div>
          <div className="text-3xl font-semibold">—</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-slate-500">Pending Approvals</div>
          <div className="text-3xl font-semibold">—</div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Recently Registered Professionals</h2>
          <button onClick={() => navigate('/admin/professionals')} className="text-sm text-cyan-500 hover:text-cyan-400">View all</button>
        </div>

        {loading ? (
          <div>Loading…</div>
        ) : recent.length === 0 ? (
          <div className="text-sm text-slate-500">No recent registrations</div>
        ) : (
          <div className="space-y-2">
            {recent.map(p => (
              <div key={p._id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{p.fullname}</div>
                  <div className="text-sm text-slate-400">{p.email} — {p.status}</div>
                </div>
                <div>
                  <button onClick={() => navigate(`/admin/professionals/${p._id}`)} className="px-3 py-1 bg-slate-700 rounded text-sm hover:bg-slate-600">View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
