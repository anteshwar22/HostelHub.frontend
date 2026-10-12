import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  BedDouble,
  Users,
  AlertCircle,
  Clock,
  ArrowRightLeft,
  Building2,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Loader2,
  UserCheck,
  Droplets,
  UtensilsCrossed,
  Ban,
  MessageSquare,
  VolumeX,
  X
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hostel selection modal state
  const [showHostelModal, setShowHostelModal] = useState(false);
  const [availableHostels, setAvailableHostels] = useState([]);
  const [selectedHostelId, setSelectedHostelId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [savingHostel, setSavingHostel] = useState(false);
  const [hostelModalError, setHostelModalError] = useState(null);

  const fetchProfile = () => {
    setLoading(true);
    api.get('/students/me')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const openHostelSelection = () => {
    setHostelModalError(null);
    setShowHostelModal(true);
    api.get('/hostels/available')
      .then((res) => {
        setAvailableHostels(res.data || []);
        if (res.data?.length > 0 && !selectedHostelId) {
          setSelectedHostelId(data?.profile?.hostelId || res.data[0].id);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSaveHostel = async (e) => {
    e.preventDefault();
    if (!selectedHostelId) {
      setHostelModalError('Please select a hostel');
      return;
    }
    setSavingHostel(true);
    setHostelModalError(null);
    try {
      await api.put('/students/me/choose-hostel', {
        hostelId: selectedHostelId,
        roomId: selectedRoomId || null
      });
      setShowHostelModal(false);
      fetchProfile();
    } catch (err) {
      setHostelModalError(err.message || 'Failed to allocate hostel');
    } finally {
      setSavingHostel(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error || !data || !data.profile) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 max-w-xl mx-auto my-12">
        <h3 className="font-bold">Failed to load student profile</h3>
        <p className="text-sm mt-1">{error || 'Profile not found. Please ensure you are logged in with a student account.'}</p>
      </div>
    );
  }

  const { profile, roommates, recentComplaints, recentPasses } = data;
  const primaryWarden = profile.hostel?.wardens?.find(w => w.isPrimary) || profile.hostel?.wardens?.[0];
  const selectedHostelObj = availableHostels.find(h => h.id === selectedHostelId);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Student Welcome Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Resident Student Profile</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name}
            </h2>
            <p className="mt-1.5 text-slate-300 text-xs sm:text-sm">
              Roll No: <span className="text-white font-mono font-bold">{profile.studentId}</span> • {profile.department} (Year {profile.yearOfStudy})
            </p>
          </div>

          {/* Room Pill in Header */}
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md">
              <BedDouble className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold tracking-wider text-purple-200">
                Current Residence
              </div>
              <div className="text-lg font-black text-white">
                {profile.room ? `Room ${profile.room.roomNumber}` : 'Unallocated'}
              </div>
              <div className="text-xs text-slate-300">
                {profile.hostel?.name || 'No Hostel Assigned'} • {profile.bedNumber || 'Bed Assigned'}
              </div>
            </div>
            {!profile.hostelId && (
              <button
                onClick={openHostelSelection}
                className="ml-2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Choose Hostel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. MANDATORY RULES & REGULATIONS BANNER */}
      <div className="p-5 sm:p-6 rounded-2xl bg-rose-50 border-2 border-rose-300/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0 shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-950">
                Hostel Code of Conduct
              </span>
              <span className="text-xs font-bold text-rose-950">
                Strict Zero-Tolerance Campus Bylaws
              </span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed max-w-3xl">
              <b>Ragging is strictly prohibited</b> by law (Supreme Court/UGC Regulations); offenders face immediate expulsion and police FIR.{' '}
              <b>Smoking cigarettes, vaping, alcohol, and drug consumption are strictly forbidden</b> on hostel premises with a ₹5,000 fine and rustication.
            </p>
          </div>
        </div>

        <Link
          to="/student/rules"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shrink-0 transition-all shadow-md shadow-rose-700/20"
        >
          <span>View All Rules</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. OFFICIAL DAILY TIMINGS & MESS SCHEDULE CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Daily Facility & Mess Schedule</h3>
              <p className="text-xs text-slate-400">Timings for hot water, dining mess, and gate access</p>
            </div>
          </div>
          <Link
            to="/student/rules"
            className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1"
          >
            <span>Full Schedule & Guidelines</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Hot Water */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-xs">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Droplets className="w-4 h-4" />
              <span>Hot Water Timing</span>
            </div>
            <div className="text-xl font-black text-white">6:00 AM – 8:00 AM</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Morning solar geyser supply across all floors
            </p>
          </div>

          {/* Mess Lunch */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-xs">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Mess Lunch</span>
            </div>
            <div className="text-xl font-black text-white">11:30 AM – 2:00 PM</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Hot lunch served in dining hall
            </p>
          </div>

          {/* Mess Dinner */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-xs">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Mess Dinner</span>
            </div>
            <div className="text-xl font-black text-white">7:30 PM – 9:30 PM</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Evening dinner counter (closes at 9:30 PM)
            </p>
          </div>

          {/* Gate In-Time */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-xs">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Ban className="w-4 h-4" />
              <span>Gate In-Time</span>
            </div>
            <div className="text-xl font-black text-white">9:30 PM Sharp</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Curfew locked at 9:30 PM; night-out pass required
            </p>
          </div>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room & Roommates Card (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Roommates Directory */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">My Room & Roommates</h3>
                  <p className="text-xs text-slate-600">
                    Room {profile.room?.roomNumber || 'N/A'} ({profile.room?.type || 'Standard'}) • {profile.hostel?.name || 'Hostel unassigned'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={openHostelSelection}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Change Hostel
                </button>
                <Link
                  to="/student/room-change"
                  className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <span>Request Room Change</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {roommates?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {roommates.map((rm) => (
                  <div
                    key={rm.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {rm.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-900 text-sm truncate">{rm.name}</div>
                      <div className="text-xs text-slate-600 font-medium">
                        {rm.studentId} • <b className="text-purple-700">{rm.bedNumber || 'Roommate'}</b>
                      </div>
                      <div className="text-[11px] text-slate-600 truncate mt-1">
                        {rm.department} (Year {rm.yearOfStudy})
                      </div>
                      {rm.phone && (
                        <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3 text-slate-600" />
                          <span>{rm.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-600">
                You are currently the only registered occupant in Room {profile.room?.roomNumber || 'your room'}.
              </div>
            )}
          </div>

          {/* Quick Services: Complaints & Passes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Recent Complaints */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>My Complaints</span>
                  </h4>
                  <Link to="/student/complaints" className="text-xs font-semibold text-purple-600 hover:underline">
                    File New +
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {recentComplaints?.length > 0 ? (
                    recentComplaints.slice(0, 3).map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 truncate">{c.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {c.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] line-clamp-1 mt-1">{c.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-600 italic py-2">No complaints filed.</p>
                  )}
                </div>
              </div>

              <Link
                to="/student/complaints"
                className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-purple-700 flex items-center justify-between"
              >
                <span>Track all complaints</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Night-Out Pass Status */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>Night-Out Pass</span>
                  </h4>
                  <Link to="/student/night-out" className="text-xs font-semibold text-purple-600 hover:underline">
                    Apply +
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {recentPasses?.length > 0 ? (
                    recentPasses.slice(0, 2).map((p) => (
                      <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 truncate">{p.destination}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1">
                          Leave: {new Date(p.leaveDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-600 italic py-2">No night-out passes applied.</p>
                  )}
                </div>
              </div>

              <Link
                to="/student/night-out"
                className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-purple-700 flex items-center justify-between"
              >
                <span>View Digital Out-Pass card</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar: Chat Room Shortcut, Warden Details & Notices */}
        <div className="space-y-6">
          {/* COMMUNITY CHAT ROOM CARD */}
          <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-purple-800/50 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Hostel Chat Room</h4>
                  <p className="text-[11px] text-purple-300">Live Resident Discussion</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Join fellow {profile.hostel?.name || 'hostel'} residents to discuss mess feedback, sports, study groups, and campus queries.
            </p>
            <Link
              to="/student/chat"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all"
            >
              <span>Enter Discussion Lounge</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Assigned Warden Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h3 className="font-bold text-slate-900 text-base mb-1">Hostel Warden</h3>
            <p className="text-xs text-slate-600 mb-4">Official supervisor and residential mentor</p>

            {primaryWarden ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    {primaryWarden.user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{primaryWarden.user.name}</div>
                    <div className="text-[11px] font-semibold text-emerald-700">{primaryWarden.designation}</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-600" />
                    <span>{primaryWarden.user.email}</span>
                  </div>
                  {primaryWarden.user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                      <span>{primaryWarden.user.phone}</span>
                    </div>
                  )}
                  {primaryWarden.officeLocation && (
                    <div className="text-[11px] text-slate-600">
                      📍 {primaryWarden.officeLocation}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600 italic">No warden assigned to this block.</p>
            )}
          </div>

          {/* Quick Notice Shortcut */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
            <h4 className="font-bold text-slate-900 text-sm mb-1">Campus & Mess Circulars</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Check out latest quiet hours, water tank maintenance, and dining menu committee updates.
            </p>
            <Link
              to="/student/notices"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <span>Open Notice Board</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CHOOSE HOSTEL MODAL */}
      {showHostelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Choose / Allocate Hostel</h3>
              </div>
              <button
                onClick={() => setShowHostelModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {hostelModalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{hostelModalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveHostel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Hostel (Allocated by Admin) *
                </label>
                <select
                  required
                  value={selectedHostelId}
                  onChange={(e) => {
                    setSelectedHostelId(e.target.value);
                    setSelectedRoomId('');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose Hostel --</option>
                  {availableHostels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.type}) • {h.availableBeds} beds free
                    </option>
                  ))}
                </select>
              </div>

              {selectedHostelObj && selectedHostelObj.availableRooms?.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Available Room (Optional)
                  </label>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Auto-allocate available bed</option>
                    {selectedHostelObj.availableRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Room {r.roomNumber} ({r.type}, Floor {r.floor}) — {r.availableSpots} spots left
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="p-3 bg-indigo-50 rounded-xl text-[11px] text-indigo-900">
                💡 Selecting your allocated hostel will instantly update your residence dashboard, roommates directory, and discussion chat room.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHostelModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingHostel || !selectedHostelId}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {savingHostel ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
