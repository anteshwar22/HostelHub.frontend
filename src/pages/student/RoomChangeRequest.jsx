import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  ArrowRightLeft,
  Plus,
  CheckCircle2,
  XCircle,
  BedDouble,
  Building2,
  Clock,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const RoomChangeRequest = () => {
  const [requests, setRequests] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    preferredRoomId: '',
    reason: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, roomRes] = await Promise.all([
        api.get('/room-change'),
        api.get('/rooms', { params: { status: 'AVAILABLE' } })
      ]);
      setRequests(reqRes.data);
      setAvailableRooms(roomRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/room-change', {
        preferredRoomId: formData.preferredRoomId || null,
        reason: formData.reason
      });
      setModalOpen(false);
      setFormData({ preferredRoomId: '', reason: '' });
      fetchData();
    } catch (err) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const hasPending = requests.some(r => r.status === 'PENDING');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Room Change Request</h2>
          <p className="text-xs text-slate-600">Apply for floor relocation, room type upgrade, or mutual swap review</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          disabled={hasPending}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>{hasPending ? 'Request Under Review' : 'New Room Change Request'}</span>
        </button>
      </div>

      {hasPending && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-800">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            You have an active pending room change request. The hostel warden is currently reviewing available bed slots.
          </span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <BedDouble className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">No Room Change Applications</h3>
          <p className="text-xs text-slate-400 mt-1">
            If you wish to change your room or floor, click the button above to submit an application.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div
              key={r.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs ${
                r.status === 'PENDING' ? 'border-purple-300 shadow-sm shadow-purple-500/10' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                    r.status === 'PENDING'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : r.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border-rose-200'
                  }`}>
                    {r.status}
                  </span>
                  <div className="text-xs text-slate-400 mt-1.5">
                    Submitted on {new Date(r.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">From</span>
                    <div className="font-bold text-slate-900">Room {r.currentRoomNumber}</div>
                  </div>
                  <ArrowRightLeft className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">To Preferred</span>
                    <div className="font-bold text-purple-700">Room {r.preferredRoomNumber}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-700">Reason: </span>
                <span className="text-slate-600">{r.reason}</span>
              </div>

              {r.remarks && (
                <div className="mt-3 text-xs text-slate-700 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                  <b className="text-purple-900">Warden Remarks:</b> "{r.remarks}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Request Room Relocation</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Room (Optional - leave empty for Any Available)
                </label>
                <select
                  value={formData.preferredRoomId}
                  onChange={(e) => setFormData({ ...formData, preferredRoomId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Any available room decided by warden</option>
                  {availableRooms.map((rm) => (
                    <option key={rm.id} value={rm.id}>
                      Room {rm.roomNumber} (Floor {rm.floor} - {rm.vacantBeds} beds vacant)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Reason for Relocation
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Explain why you are requesting this change (study hours, floor preference, medical reasons, etc.)..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
