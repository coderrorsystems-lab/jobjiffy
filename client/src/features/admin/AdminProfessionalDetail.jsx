import React, { useEffect, useState } from 'react';
import { fetchProfessional, approveProfessional } from './adminAPI';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminProfessionalDetail(){
  const { id } = useParams();
  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{
    (async ()=>{
      setLoading(true);
      try{
        const data = await fetchProfessional(id);
        setProf(data.professional || null);
      }catch(e){ setError(e?.response?.data?.message || 'Failed'); }
      setLoading(false);
    })();
  },[id]);

  const handleApprove = async () => {
    try{
      await approveProfessional(id);
      setProf(p => p ? { ...p, status: 'approved' } : p);
    }catch(e){ setError(e?.response?.data?.message || 'Approve failed'); }
  };

  if(loading) return <div className="p-6">Loading…</div>;
  if(!prof) return <div className="p-6">No professional found.</div>;

  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="mb-4">Back</button>
      <h2 className="text-2xl font-bold mb-2">{prof.fullname}</h2>
      <p className="text-sm text-slate-400">{prof.email} — Status: {prof.status}</p>
      <div className="mt-4">
        <h3 className="font-medium">Services</h3>
        <ul className="list-disc pl-6">
          {prof.services?.map((s, i) => <li key={i}>{s.serviceName} ({s.category}) — ₹{s.price}</li>)}
        </ul>
      </div>
      <div className="mt-4">
        <h3 className="font-medium">KYC</h3>
        <p>{prof.kycDocuments?.collegeId || '—'}</p>
      </div>
      <div className="mt-6">
        {prof.status !== 'approved' && <button onClick={handleApprove} className="px-4 py-2 bg-cyan-600 text-white rounded">Approve</button>}
      </div>
    </div>
  );
}
