import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Bell,
  Plus,
  Trash2,
  AlertTriangle,
  Calendar,
  Building2,
  CheckCircle2,
  X,
  Loader2
} from 'lucide-react';

export const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    hostelId: '',
    isImportant: false,
    expiresAt: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [noticeRes, hostelRes] = await Promise.all([
        api.get('/notices'),
        api.get('/hostels')
      ]);
      setNotices(noticeRes.data);
      setHostels(hostelRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/notices', {
        ...formData,
        hostelId: formData.hostelId || null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
      });
      setModalOpen(false);
      setFormData({
        title: '',
        content: '',
        category: 'General',
        hostelId: '',
        isImportant: false,
        expiresAt: ''
      });
      fetchData();
    } catch (err) {
      alert(err.message || 'Publishing notice failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this circular announcement?')) return;
    try {
      await api.delete(`/notices/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete notice');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Campus & Hostel Notices</h2>
          <p className="text-xs text-slate-600">Publish urgent circulars, mess menus, maintenance announcements, and discipline rules</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Notice</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`p-6 rounded-2xl border transition-all bg-white ${
                notice.isImportant
                  ? 'border-amber-300 shadow-sm shadow-amber-500/10'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {notice.isImportant && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Important Circular
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {notice.category}
                    </span>
                    <span className="text-xs text-slate-600">
                      {notice.hostel ? `🏢 Target: ${notice.hostel.name}` : '🌐 Campus-Wide Notice'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{notice.title}</h3>
                </div>

                <button
                  onClick={() => handleDelete(notice.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Delete Notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="mt-3 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {notice.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
                <span>Published by: <b className="text-slate-800">{notice.author?.name}</b> ({notice.author?.role})</span>
                <span>Date: {new Date(notice.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publish Notice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Broadcast Notice</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Water Maintenance"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="General">General</option>
                    <option value="Rules">Discipline & Rules</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Mess">Mess & Food</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Hostel</label>
                  <select
                    value={formData.hostelId}
                    onChange={(e) => setFormData({ ...formData, hostelId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Campus-Wide (All Hostels)</option>
                    {hostels.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Content</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Details of the announcement..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isImportant"
                  checked={formData.isImportant}
                  onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <label htmlFor="isImportant" className="text-xs font-semibold text-slate-700 select-none">
                  Mark as High-Priority / Important Announcement
                </label>
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
