import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Wrench,
  Search,
  X,
  Loader2,
  Calendar,
  User,
  BedDouble
} from 'lucide-react';

export const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Resolution Modal
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: 'IN_PROGRESS',
    assignedTo: '',
    resolutionNotes: ''
  });

  const fetchComplaints = () => {
    setLoading(true);
    api.get('/complaints', {
      params: {
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined
      }
    })
      .then(res => {
        setComplaints(res.data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedStatus, selectedCategory]);

  const handleOpenAction = (complaint) => {
    setActiveComplaint(complaint);
    setUpdateData({
      status: complaint.status === 'OPEN' ? 'IN_PROGRESS' : complaint.status,
      assignedTo: complaint.assignedTo || '',
      resolutionNotes: complaint.resolutionNotes || ''
    });
    setModalOpen(true);
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    if (!activeComplaint) return;
    setSubmitting(true);
    try {
      await api.put(`/complaints/${activeComplaint.id}`, updateData);
      setModalOpen(false);
      fetchComplaints();
    } catch (err) {
      alert(err.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hostel Complaints & Maintenance Desk</h2>
        <p className="text-xs text-slate-600">Track and resolve student grievances, facility repairs, and technical requests</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filter:</span>
        </div>

        {/* Status Pills */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedStatus === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500"
        >
          <option value="ALL">All Categories</option>
          <option value="Electrical">Electrical</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Internet">Internet</option>
          <option value="Furniture">Furniture</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Water">Water</option>
          <option value="Food">Food / Mess</option>
          <option value="Room">Room</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Complaints Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : complaints.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
          <p className="font-semibold text-sm">No complaints found for the selected filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Title & Description</th>
                  <th className="px-5 py-3.5">Category & Priority</th>
                  <th className="px-5 py-3.5">Filed By</th>
                  <th className="px-5 py-3.5">Room</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Technician / Notes</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 max-w-xs">
                      <div className="font-bold text-slate-900 text-sm">{c.title}</div>
                      <div className="text-slate-600 text-xs mt-1 line-clamp-2">{c.description}</div>
                      <div className="text-[10px] text-slate-600 mt-1">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 mb-1">
                        {c.category}
                      </span>
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.priority === 'URGENT'
                            ? 'bg-rose-100 text-rose-800'
                            : c.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.priority} Priority
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{c.studentName}</div>
                      <div className="text-[11px] text-slate-600">{c.studentRollNo}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {c.roomNumber}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        c.status === 'OPEN'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : c.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : c.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      {c.assignedTo && (
                        <div className="text-[11px] font-semibold text-slate-800">
                          🔧 Tech: {c.assignedTo}
                        </div>
                      )}
                      {c.resolutionNotes && (
                        <div className="text-[11px] text-slate-600 italic line-clamp-2 mt-0.5">
                          "{c.resolutionNotes}"
                        </div>
                      )}
                      {!c.assignedTo && !c.resolutionNotes && (
                        <span className="text-slate-600 italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleOpenAction(c)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors"
                      >
                        Update Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {modalOpen && activeComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Update Complaint Ticket</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-900">{activeComplaint.title}</div>
              <div className="text-slate-600">{activeComplaint.description}</div>
              <div className="text-slate-600 text-[11px]">
                Filed by {activeComplaint.studentName} (Room {activeComplaint.roomNumber})
              </div>
            </div>

            <form onSubmit={handleUpdateComplaint} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Update Status</label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  <option value="OPEN">OPEN (Waiting for technician)</option>
                  <option value="IN_PROGRESS">IN PROGRESS (Work started)</option>
                  <option value="RESOLVED">RESOLVED (Issue fixed)</option>
                  <option value="REJECTED">REJECTED (Invalid / duplicate)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Technician / Staff</label>
                <input
                  type="text"
                  placeholder="e.g. Electrician Ramesh / Plumber John"
                  value={updateData.assignedTo}
                  onChange={(e) => setUpdateData({ ...updateData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resolution Notes</label>
                <textarea
                  rows="3"
                  placeholder="Actions taken, parts replaced, or remarks..."
                  value={updateData.resolutionNotes}
                  onChange={(e) => setUpdateData({ ...updateData, resolutionNotes: e.target.value })}
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Updates</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
