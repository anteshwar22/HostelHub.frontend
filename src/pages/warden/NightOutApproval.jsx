import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Calendar,
  MapPin,
  Phone,
  User,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const NightOutApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Review Modal
  const [activeRequest, setActiveRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('APPROVED');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = () => {
    setLoading(true);
    api.get('/night-out', {
      params: { status: selectedStatus !== 'ALL' ? selectedStatus : undefined }
    })
      .then(res => setRequests(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedStatus]);

  const handleOpenReview = (req, defaultStatus) => {
    setActiveRequest(req);
    setReviewStatus(defaultStatus);
    setRemarks(defaultStatus === 'APPROVED' ? 'Approved. Maintain curfew and carry student ID.' : '');
    setModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!activeRequest) return;
    setSubmitting(true);
    try {
      await api.put(`/night-out/${activeRequest.id}/review`, {
        status: reviewStatus,
        remarks
      });
      setModalOpen(false);
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Night-Out & Leave Pass Authorization</h2>
        <p className="text-xs text-slate-600">Review student overnight travel applications, parental verification, and sign off passes</p>
      </div>

      {/* Filter tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedStatus === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <Clock className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-sm">No night-out applications under this status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((r) => (
            <div
              key={r.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                r.status === 'PENDING' ? 'border-amber-300 shadow-sm shadow-amber-500/10' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{r.studentName}</h3>
                    <div className="text-xs text-slate-600">
                      {r.studentRollNo} • Room {r.roomNumber} ({r.department})
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                    r.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : r.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border-rose-200'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="font-bold shrink-0">Reason:</span>
                    <span>{r.reason}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span><b>Destination:</b> {r.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span>
                      <b>Leave:</b> {new Date(r.leaveDate).toLocaleDateString(undefined, { dateStyle: 'medium' })} → 
                      <b> Return:</b> {new Date(r.returnDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span><b>Emergency / Parent Contact:</b> {r.emergencyContact}</span>
                  </div>
                </div>

                {r.remarks && (
                  <div className="mt-3 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <b>Warden Remarks:</b> "{r.remarks}"
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
                    Reject Pass
                  </button>
                  <button
                    onClick={() => handleOpenReview(r, 'APPROVED')}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Pass</span>
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Reviewed by {r.reviewedByName || 'Warden'}</span>
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
                {reviewStatus === 'APPROVED' ? 'Approve Night-Out Application' : 'Reject Night-Out Application'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div>Student: <b>{activeRequest.studentName}</b> ({activeRequest.studentRollNo})</div>
              <div>Destination: <b>{activeRequest.destination}</b></div>
              <div>Emergency Phone: <b>{activeRequest.emergencyContact}</b></div>
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Warden Notes & Remarks
                </label>
                <textarea
                  rows="3"
                  required={reviewStatus === 'REJECTED'}
                  placeholder="Instructions for student, curfew times, or reason for rejection..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
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
                    reviewStatus === 'APPROVED'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-rose-600 hover:bg-rose-500'
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
