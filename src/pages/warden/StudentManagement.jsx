import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  BedDouble,
  Phone,
  Mail,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const StudentManagement = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [allocationFilter, setAllocationFilter] = useState('ALL');

  // Admission Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'Student@123',
    studentId: '',
    department: 'Computer Science & Engineering',
    yearOfStudy: 1,
    phone: '',
    emergencyContact: '',
    guardianName: '',
    guardianPhone: '',
    roomId: '',
    bedNumber: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const hostelId = user?.wardenProfile?.hostelId;
      const [studentRes, roomRes] = await Promise.all([
        api.get('/students', {
          params: {
            hostelId,
            search: search || undefined,
            status: allocationFilter !== 'ALL' ? allocationFilter : undefined
          }
        }),
        api.get('/rooms', { params: { hostelId, status: 'AVAILABLE' } })
      ]);
      setStudents(studentRes.data);
      setRooms(roomRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [allocationFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleOpenAdmit = () => {
    setFormData({
      name: '',
      email: '',
      password: 'Student@123',
      studentId: `HST-2026-${Math.floor(100 + Math.random() * 900)}`,
      department: 'Computer Science & Engineering',
      yearOfStudy: 1,
      phone: '',
      emergencyContact: '',
      guardianName: '',
      guardianPhone: '',
      roomId: '',
      bedNumber: ''
    });
    setModalOpen(true);
  };

  const handleAdmitStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const hostelId = user?.wardenProfile?.hostelId;
      await api.post('/students', {
        ...formData,
        hostelId,
        yearOfStudy: parseInt(formData.yearOfStudy, 10),
        roomId: formData.roomId || null,
        bedNumber: formData.bedNumber || null
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Admission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Roster & Admissions</h2>
          <p className="text-xs text-slate-600">Register new hostel residents and manage student profiles and room occupancy</p>
        </div>
        <button
          onClick={handleOpenAdmit}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Admit New Student</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, student ID, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
          />
        </form>

        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setAllocationFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              allocationFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            All Students
          </button>
          <button
            onClick={() => setAllocationFilter('ALLOCATED')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              allocationFilter === 'ALLOCATED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Allocated
          </button>
          <button
            onClick={() => setAllocationFilter('UNALLOCATED')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              allocationFilter === 'UNALLOCATED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Unallocated
          </button>
        </div>
      </div>

      {/* Student Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Student Details</th>
                  <th className="px-5 py-3.5">Roll No & Branch</th>
                  <th className="px-5 py-3.5">Room & Bed</th>
                  <th className="px-5 py-3.5">Contact Info</th>
                  <th className="px-5 py-3.5">Guardian Details</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 text-sm">{st.name}</div>
                      <div className="text-[11px] text-slate-600">{st.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">{st.studentId}</div>
                      <div className="text-[11px] text-slate-600">{st.department} • Year {st.yearOfStudy}</div>
                    </td>
                    <td className="px-5 py-4">
                      {st.roomId ? (
                        <div>
                          <span className="inline-flex items-center gap-1 font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            <BedDouble className="w-3.5 h-3.5 text-emerald-600" />
                            Room {st.roomNumber}
                          </span>
                          <span className="block text-[10px] text-slate-600 mt-0.5">{st.bedNumber}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Unallocated
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div>{st.phone || 'N/A'}</div>
                      {st.emergencyContact && (
                        <div className="text-[10px] text-slate-600">Emerg: {st.emergencyContact}</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-800">{st.guardianName || 'N/A'}</div>
                      <div className="text-[11px] text-slate-600">{st.guardianPhone || ''}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Enrolled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admit Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Admit New Student</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdmitStudent} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanmay Joshi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID / Roll No</label>
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Year of Study</label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Room (Optional)</label>
                  <select
                    value={formData.roomId}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Allocate later --</option>
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>
                        Room {r.roomNumber} ({r.vacantBeds} beds vacant)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bed Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Bed A, Bed 1"
                    value={formData.bedNumber}
                    onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    placeholder="Parent / Guardian"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Phone</label>
                  <input
                    type="text"
                    placeholder="+91 99887 76655"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
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
                  <span>Admit Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
