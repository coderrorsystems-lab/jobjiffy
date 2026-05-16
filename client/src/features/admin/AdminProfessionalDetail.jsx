import React, { useEffect, useState } from 'react';
import { fetchProfessional, approveProfessional } from './services/adminAPI';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, AlertCircle, Star, FileText } from 'lucide-react';

export default function AdminProfessionalDetail(){
  const { id } = useParams();
  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    (async ()=>{
      setLoading(true);
      try{
        const data = await fetchProfessional(id);
        setProf(data.professional || data.data || null);
      }catch(e){ 
        setError(e?.response?.data?.message || 'Failed to load professional'); 
        console.error('Error:', e);
      }
      setLoading(false);
    })();
  },[id]);

  const handleApprove = async () => {
    if(!window.confirm('Approve this professional?')) return;
    setActionLoading(true);
    try{
      await approveProfessional(id);
      setProf(p => p ? { ...p, status: 'approved' } : p);
      setError('');
    }catch(e){ 
      setError(e?.response?.data?.message || 'Approval failed'); 
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if(!window.confirm('Reject this professional?')) return;
    setActionLoading(true);
    try{
      // TODO: Add reject endpoint
      setError('');
    }catch(e){ 
      setError(e?.response?.data?.message || 'Rejection failed'); 
    }
    setActionLoading(false);
  };

  if(loading) return (
    <div className="flex items-center justify-center p-6 min-h-screen">
      <div className="text-slate-400">Loading professional details...</div>
    </div>
  );

  if(!prof) return (
    <div className="flex items-center justify-center p-6 min-h-screen">
      <div className="text-slate-400">No professional found.</div>
    </div>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-900/30 text-green-400 border border-green-700';
      case 'rejected': return 'bg-red-900/30 text-red-400 border border-red-700';
      default: return 'bg-yellow-900/30 text-yellow-400 border border-yellow-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(prof.status)}`}>
          {prof.status?.toUpperCase()}
        </span>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg mb-6 flex gap-2">
          <AlertCircle size={20} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Profile Info */}
        <div className="lg:col-span-2">
          {/* Basic Info */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">{prof.fullname}</h2>
            <p className="text-slate-400">{prof.category?.replace(/_/g, ' ')?.toUpperCase()}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-slate-500 text-sm">Email</p>
                <p className="text-white break-all">{prof.email}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Phone</p>
                <p className="text-white">{prof.phone}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Experience</p>
                <p className="text-white">{prof.experience || 0} years</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Email Verified</p>
                <p className="text-white">{prof.isEmailVerified ? '✅ Yes' : '❌ No'}</p>
              </div>
            </div>

            {prof.bio && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-slate-500 text-sm">Bio</p>
                <p className="text-slate-300">{prof.bio}</p>
              </div>
            )}
          </div>

          {/* Address & Location */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Address & Location</h3>
            <div className="grid grid-cols-2 gap-4">
              {prof.streetAddress && (
                <div className="col-span-2">
                  <p className="text-slate-500 text-sm">Street Address</p>
                  <p className="text-white">{prof.streetAddress}</p>
                </div>
              )}
              <div>
                <p className="text-slate-500 text-sm">City</p>
                <p className="text-white">{prof.city || '—'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">State</p>
                <p className="text-white">{prof.state || '—'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Zip Code</p>
                <p className="text-white">{prof.zipCode || '—'}</p>
              </div>
            </div>
          </div>

          {/* Education Details */}
          {(prof.collegeName || prof.department || prof.yearOfGraduation) && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Education Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {prof.collegeName && (
                  <div className="col-span-2">
                    <p className="text-slate-500 text-sm">College Name</p>
                    <p className="text-white">{prof.collegeName}</p>
                  </div>
                )}
                {prof.department && (
                  <div>
                    <p className="text-slate-500 text-sm">Department</p>
                    <p className="text-white">{prof.department}</p>
                  </div>
                )}
                {prof.yearOfGraduation && (
                  <div>
                    <p className="text-slate-500 text-sm">Year of Graduation</p>
                    <p className="text-white">{prof.yearOfGraduation}</p>
                  </div>
                )}
                {prof.collegeEmail && (
                  <div className="col-span-2">
                    <p className="text-slate-500 text-sm">College Email</p>
                    <p className="text-white break-all">{prof.collegeEmail}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Services */}
          {prof.services && prof.services.length > 0 && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Services ({prof.services.length})</h3>
              <div className="space-y-4">
                {prof.services.map((service, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{service.serviceName}</h4>
                      <span className="text-cyan-400 font-bold">₹{service.price}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{service.category?.toUpperCase()}</p>
                    {service.desc && <p className="text-slate-300 text-sm mt-2">{service.desc}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bank Details */}
          {(prof.accountNumber || prof.upiId) && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {prof.accountHolderName && (
                  <div className="col-span-2">
                    <p className="text-slate-500 text-sm">Account Holder</p>
                    <p className="text-white">{prof.accountHolderName}</p>
                  </div>
                )}
                {prof.accountNumber && (
                  <div className="col-span-2">
                    <p className="text-slate-500 text-sm">Account Number</p>
                    <p className="text-white font-mono">{prof.accountNumber}</p>
                  </div>
                )}
                {prof.ifscCode && (
                  <div>
                    <p className="text-slate-500 text-sm">IFSC Code</p>
                    <p className="text-white font-mono">{prof.ifscCode}</p>
                  </div>
                )}
                {prof.upiId && (
                  <div>
                    <p className="text-slate-500 text-sm">UPI ID</p>
                    <p className="text-white">{prof.upiId}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Admin Actions & Stats */}
        <div>
          {/* Stats */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-400" />
                  <span className="text-slate-300">Rating</span>
                </div>
                <span className="text-white font-bold">{prof.rating?.toFixed(1) || 0}/5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-blue-400" />
                  <span className="text-slate-300">Reviews</span>
                </div>
                <span className="text-white font-bold">{prof.totalReviews || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Account Status</span>
                <span className={prof.isActive ? 'text-green-400' : 'text-red-400'}>
                  {prof.isActive ? '🟢 Active' : '🔴 Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Available</span>
                <span className={prof.isAvailable ? 'text-green-400' : 'text-red-400'}>
                  {prof.isAvailable ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              {prof.walletBalance !== undefined && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <span className="text-slate-300">Wallet Balance</span>
                  <span className="text-green-400 font-bold">₹{prof.walletBalance?.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Admin Actions</h3>
            <div className="space-y-3">
              {prof.status !== 'approved' && (
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
                >
                  <Check size={18} />
                  Approve Professional
                </button>
              )}
              {prof.status !== 'rejected' && (
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
                >
                  <X size={18} />
                  Reject
                </button>
              )}
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-lg transition"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
