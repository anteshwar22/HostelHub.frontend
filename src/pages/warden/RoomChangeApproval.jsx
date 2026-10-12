import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  BedDouble,
  Building2,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const RoomChangeApproval = () => {
  const [requests, setRequests] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('APPROVED');
  const [targetRoomId, setTargetRoomId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleOpenReview = (req, status) => {
    setActiveRequest(req);
    setReviewStatus(status);
    setTargetRoomId(req.preferredRoomId || '');
    setRemarks(status === 'APPROVED' ? 'Approved student relocation' : '');
    setModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!activeRequest) return;
    setSubmitting(true);
    try {
      await api.put(`/room-change/${activeRequest.id}/review`, {
        status: reviewStatus,
        targetRoomId: reviewStatus === 'APPROVED' ? targetRoomId : undefined,
        remarks
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Review failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Room Change Application Review</h2>
        <p className="text-xs text-slate-600">Process student requests for room relocation, floor changes, and bed transfers</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <ArrowRightLeft className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-sm">No room change applications found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((r) => (
            <div
              key={r.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                r.status === 'PENDING' ? 'border-purple-300 shadow-sm shadow-purple-500/10' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{r.studentName}</h3>
                    <div className="text-xs text-slate-600">
                      {r.studentRollNo} • {r.department}
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                    r.status === 'PENDING'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : r.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border-rose-200'
                  }`}>
                    {r.status}
                  </span>
                </div>

                {/* Transfer Diagram */}
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Current Room</span>
                    <div className="font-extrabold text-slate-900 text-sm">Room {r.currentRoomNumber}</div>
                    <div className="text-[11px] text-slate-600">Floor {r.currentFloor}</div>
                  </div>

                  <ArrowRightLeft className="w-5 h-5 text-indigo-500" />

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Requested Target</span>
                    <div className="font-extrabold text-indigo-600 text-sm">Room {r.preferredRoomNumber}</div>
                    <div className="text-[11px] text-slate-600">
                      {r.preferredFloor ? `Floor ${r.preferredFloor}` : 'Any Available'}
                      {r.preferredRoomOccupancy && ` (${r.preferredRoomOccupancy} occ)`}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Reason for Request:</span>
                  <p className="mt-1 text-slate-600">{r.reason}</p>
                </div>

                {r.remarks && (
                  <div className="mt-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <b>Warden Decision Remarks:</b> "{r.remarks}"
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {r.status === 'PENDING' ? (
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenReview(r, 'REJECTED')}
                    className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleOpenReview(r, 'APPROVED')}
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Relocate</span>
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Processed by {r.reviewedByName || 'Warden'}</span>
                  <span>{new Date(r.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {modalOpen && activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">
                {reviewStatus === 'APPROVED' ? 'Approve & Reassign Room' : 'Reject Room Change Request'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
              {reviewStatus === 'APPROVED' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assign To Available Room
                  </label>
                  <select
                    required
                    value={targetRoomId}
                    onChange={(e) => setTargetRoomId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">-- Select Destination Room --</option>
                    {availableRooms.map((rm) => (
                      <option key={rm.id} value={rm.id}>
                        Room {rm.roomNumber} (Floor {rm.floor} - {rm.vacantBeds} beds vacant)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Warden Remarks
                </label>
                <textarea
                  rows="3"
                  required={reviewStatus === 'REJECTED'}
                  placeholder="Notes or instructions for room handover..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
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
                  className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-1.5 ${
                    reviewStatus === 'APPROVED' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm {reviewStatus}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
