import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Bell,
  AlertTriangle,
  Filter,
  Building2,
  Calendar,
  Loader2
} from 'lucide-react';

export const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    setLoading(true);
    api.get('/notices', {
      params: {
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined
      }
    })
      .then(res => setNotices(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hostel & Campus Notice Board</h2>
        <p className="text-xs text-slate-600">Official circulars, mess schedules, quiet hours rules, and facility announcements</p>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'Rules', 'Maintenance', 'Mess', 'General', 'Emergency'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Notices' : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : notices.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <Bell className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-sm">No notices found in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((n) => (
            <div
              key={n.id}
              className={`p-6 rounded-2xl border bg-white transition-all ${
                n.isImportant
                  ? 'border-amber-300 shadow-sm shadow-amber-500/10'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {n.isImportant && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Important Announcement
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {n.category}
                </span>
                <span className="text-xs text-slate-500">
                  {n.hostel ? `🏢 ${n.hostel.name}` : '🌐 Campus-Wide'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{n.title}</h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {n.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Issued by: <b>{n.author?.name}</b> ({n.author?.role})</span>
                <span>{new Date(n.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
