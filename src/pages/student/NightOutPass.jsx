import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  Phone,
  ShieldCheck,
  Building2,
  QrCode,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const NightOutPass = () => {
  const { user } = useAuth();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Application Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    reason: '',
    leaveDate: '',
    returnDate: '',
    emergencyContact: ''
  });

  const fetchPasses = () => {
    setLoading(true);
    api.get('/night-out')
      .then(res => setPasses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/night-out', formData);
      setModalOpen(false);
      setFormData({
        destination: '',
        reason: '',
        leaveDate: '',
        returnDate: '',
        emergencyContact: ''
      });
      fetchPasses();
    } catch (err) {
      alert(err.message || 'Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  const activePass = passes.find(p => p.status === 'APPROVED' || p.status === 'PENDING');

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Night-Out & Leave Pass Portal</h2>
          <p className="text-xs text-slate-600">Apply for overnight leave passes, view parental verification details, and generate digital gate slips</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Night-Out Pass</span>
        </button>
      </div>

      {/* Featured Digital Gate Pass (if approved or pending) */}
      {activePass && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden">
          {/* Watermark seal background */}
          <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
            <Building2 className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-indigo-500/20">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider border border-indigo-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Official Digital Hostel Out-Pass</span>
              </div>
              <h3 className="text-2xl font-black mt-2 tracking-tight">
                {activePass.studentName}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Roll No: <span className="font-mono font-bold text-white">{activePass.studentRollNo}</span> • Room {activePass.roomNumber} ({activePass.hostelName})
              </p>
            </div>

            {/* Status Stamp */}
            <div className={`px-4 py-2 rounded-2xl border text-center ${
              activePass.status === 'APPROVED'
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 shadow-lg shadow-emerald-500/20'
                : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
            }`}>
              <div className="text-[10px] uppercase font-extrabold tracking-widest">GATE PASS STATUS</div>
              <div className="text-xl font-black tracking-tight">{activePass.status}</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-xs">
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Destination</span>
              <div className="font-bold text-white mt-1 text-sm">{activePass.destination}</div>
            </div>

            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Departure Date</span>
              <div className="font-bold text-white mt-1">
                {new Date(activePass.leaveDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </div>
            </div>

            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Expected Return</span>
              <div className="font-bold text-white mt-1">
                {new Date(activePass.returnDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </div>
            </div>

            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Parent / Contact</span>
              <div className="font-bold text-white mt-1">{activePass.emergencyContact}</div>
            </div>
          </div>

          {/* Pass Footer with QR aesthetic & remarks */}
          <div className="relative z-10 mt-6 pt-5 border-t border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white">Reason: </span>
              {activePass.reason}
              {activePass.remarks && (
                <div className="mt-1 text-emerald-300 text-[11px]">
                  <b>Warden Approval Remarks:</b> "{activePass.remarks}"
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
              <span>PASS_ID: {activePass.id.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
        </div>
      )}

      {/* History of Past Passes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Pass Application History</h3>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : passes.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4">No past night-out passes recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Emergency Contact</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Warden Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {passes.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{p.destination}</td>
                    <td className="px-4 py-3.5 max-w-xs truncate">{p.reason}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {new Date(p.leaveDate).toLocaleDateString()} → {new Date(p.returnDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5">{p.emergencyContact}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        p.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 italic">
                      {p.remarks || (p.status === 'PENDING' ? 'Under Review' : 'No remarks')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Apply for Night-Out Pass</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Address / City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parents home in Pune, Maharashtra"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Overnight Leave</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Detailed purpose of visit..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Departure Date</label>
                  <input
                    type="date"
                    required
                    value={formData.leaveDate}
                    onChange={(e) => setFormData({ ...formData, leaveDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Return Date</label>
                  <input
                    type="date"
                    required
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parent / Guardian Emergency Contact
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Submit Pass Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
