import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Building2,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Lock,
  Mail,
  User,
  Phone,
  BookOpen,
  BedDouble,
  Loader2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  LogOut,
  ChevronRight
} from 'lucide-react';

export const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, registerStudent, demoLogin, logout, isAuthenticated, role } = useAuth();

  // Determine initial mode from query params or path: 'student', 'staff', 'register'
  const searchParams = new URLSearchParams(location.search);
  const initialRoleParam = searchParams.get('role');
  const [mode, setMode] = useState(() => {
    if (location.pathname === '/register') return 'register';
    if (initialRoleParam === 'staff' || initialRoleParam === 'admin' || initialRoleParam === 'warden') return 'staff';
    return 'student'; // Default to student login
  });

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Student login form state
  const [studentEmail, setStudentEmail] = useState('student1@hms.com');
  const [studentPassword, setStudentPassword] = useState('Student@123');

  // Staff login form state
  const [staffEmail, setStaffEmail] = useState('admin@hms.com');
  const [staffPassword, setStaffPassword] = useState('Admin@123');

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    phone: '',
    department: 'Computer Science & Engineering',
    yearOfStudy: 1,
    hostelId: '',
    roomId: '',
    emergencyContact: '',
  });

  // Hostels available for selection
  const [availableHostels, setAvailableHostels] = useState([]);
  const [loadingHostels, setLoadingHostels] = useState(false);

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch available hostels on mount
  useEffect(() => {
    setLoadingHostels(true);
    api.get('/hostels/available')
      .then((res) => {
        setAvailableHostels(res.data || []);
        if (res.data?.length > 0 && !regData.hostelId) {
          setRegData((prev) => ({ ...prev, hostelId: res.data[0].id }));
        }
      })
      .catch((err) => console.error('Failed to load hostels for selection:', err))
      .finally(() => setLoadingHostels(false));
  }, []);

  const redirectAfterLogin = (userRole) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login' && from !== '/register') {
      navigate(from, { replace: true });
      return;
    }
    if (userRole === 'ADMIN') navigate('/admin', { replace: true });
    else if (userRole === 'WARDEN') navigate('/warden', { replace: true });
    else if (userRole === 'STUDENT') navigate('/student', { replace: true });
    else navigate('/', { replace: true });
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      const loggedUser = await login(studentEmail, studentPassword);
      redirectAfterLogin(loggedUser.role);
    } catch (err) {
      setError(err.message || 'Student login failed. Please verify email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      const loggedUser = await login(staffEmail, staffPassword);
      redirectAfterLogin(loggedUser.role);
    } catch (err) {
      setError(err.message || 'Staff login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    if (!regData.hostelId) {
      setError('Please select an allocated hostel for your admission.');
      setSubmitting(false);
      return;
    }

    try {
      const newUser = await registerStudent({
        ...regData,
        yearOfStudy: parseInt(regData.yearOfStudy, 10) || 1,
        roomId: regData.roomId || null,
      });
      redirectAfterLogin(newUser.role || 'STUDENT');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (targetRole) => {
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      const loggedUser = await demoLogin(targetRole);
      redirectAfterLogin(loggedUser.role);
    } catch (err) {
      setError(err.message || 'Quick demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedHostelObj = availableHostels.find((h) => h.id === regData.hostelId);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 border border-indigo-400/30">
            <Building2 className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-white tracking-tight">
          Hostel<span className="text-indigo-400">Hub</span> Portal
        </h2>
        <p className="mt-1.5 text-center text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Campus Residence System: Student Allocation, Discussion Lounge, Timings & Services
        </p>

        {/* 3-Tab Switcher: Student Login vs Staff/Admin vs Registration */}
        <div className="mt-6 flex justify-center px-2">
          <div className="p-1 bg-slate-800/90 rounded-2xl border border-slate-700 flex flex-wrap justify-center gap-1 shadow-inner max-w-full">
            <button
              type="button"
              onClick={() => {
                setMode('student');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                mode === 'student'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('staff');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                mode === 'staff'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Staff / Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                mode === 'register'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Register Student</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4 sm:px-0">
        <div className="bg-slate-800/90 backdrop-blur-md py-7 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-700">
          
          {/* Active Session Notification (Allows seamless switch instead of forced auto-redirect) */}
          {isAuthenticated && user && (
            <div className="mb-6 p-4 rounded-xl bg-indigo-950/70 border border-indigo-500/40 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
                    Currently Signed In
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {user.name} <span className="text-xs text-indigo-200 font-normal">({user.role})</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => redirectAfterLogin(user.role)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Go to {user.role} Portal →
                </button>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold border border-slate-600 transition-all flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400 text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: STUDENT LOGIN */}
          {mode === 'student' && (
            <div>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <span>Student Resident Portal Login</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Access your hostel room, roommate details, facility timings, rules, and community chat.
                </p>
              </div>

              {/* 1-Click Demo Student Button */}
              <div className="mb-5 p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Demo Student Account</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    student1@hms.com / Student@123
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('STUDENT')}
                  disabled={submitting}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex items-center gap-1 shrink-0"
                >
                  <span>1-Click Sign In</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-800 px-3 text-slate-400 font-medium">Or enter student credentials</span>
                </div>
              </div>

              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Student Email Address
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="student1@hms.com"
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md shadow-purple-600/30 transition-all disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing into Student Portal...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as Student</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-slate-400">
                New student resident?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-purple-400 hover:underline"
                >
                  Register & Choose Your Hostel →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: STAFF & ADMIN LOGIN */}
          {mode === 'staff' && (
            <div>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span>Warden & Administration Login</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage hostel blocks, room assignments, leave passes, complaints, and campus notices.
                </p>
              </div>

              {/* 1-Click Demo Staff Buttons */}
              <div className="mb-5">
                <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Click Demo Logins</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('ADMIN')}
                    disabled={submitting}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-blue-600/10 hover:border-blue-500/40 text-slate-300 hover:text-white transition-all text-xs font-semibold group"
                  >
                    <ShieldCheck className="w-5 h-5 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-white">Administrator</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">admin@hms.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('WARDEN')}
                    disabled={submitting}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-emerald-600/10 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all text-xs font-semibold group"
                  >
                    <UserCheck className="w-5 h-5 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-white">Warden</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">warden.boys@hms.com</span>
                  </button>
                </div>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-800 px-3 text-slate-400 font-medium">Or enter credentials</span>
                </div>
              </div>

              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Staff Email Address
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      placeholder="admin@hms.com"
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as Staff</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: STUDENT REGISTRATION & HOSTEL SELECTION */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs leading-relaxed flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Register as a student resident and choose from the hostels configured and allocated by campus administration.
                </span>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="block w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="rahul@university.edu"
                      className="block w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      placeholder="Min 6 characters"
                      className="block w-full pl-9 pr-10 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student ID / Roll No *
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={regData.studentId}
                      onChange={(e) => setRegData({ ...regData, studentId: e.target.value })}
                      placeholder="e.g. 2024-CS-088"
                      className="block w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Department / Course *
                  </label>
                  <select
                    value={regData.department}
                    onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                    className="block w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Business Administration">Business Administration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Year of Study *
                  </label>
                  <select
                    value={regData.yearOfStudy}
                    onChange={(e) => setRegData({ ...regData, yearOfStudy: e.target.value })}
                    className="block w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={1}>1st Year (Fresher)</option>
                    <option value={2}>2nd Year (Sophomore)</option>
                    <option value={3}>3rd Year (Junior)</option>
                    <option value={4}>4th Year (Senior)</option>
                  </select>
                </div>
              </div>

              {/* HOSTEL ALLOCATION / SELECTION */}
              <div className="pt-2 border-t border-slate-700/80">
                <label className="block text-xs font-bold text-indigo-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    Choose Allocated Hostel *
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Allocated by Admin</span>
                </label>

                {loadingHostels ? (
                  <div className="text-xs text-slate-400 py-2 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Loading available hostels...
                  </div>
                ) : availableHostels.length === 0 ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs">
                    No hostels currently listed. Please contact administration.
                  </div>
                ) : (
                  <select
                    required
                    value={regData.hostelId}
                    onChange={(e) => setRegData({ ...regData, hostelId: e.target.value, roomId: '' })}
                    className="block w-full px-3 py-2 bg-slate-900/80 border border-indigo-500/50 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Select Your Hostel --</option>
                    {availableHostels.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.type}) • {h.availableBeds} beds available
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Room Selection (Optional if rooms are available in chosen hostel) */}
              {selectedHostelObj && selectedHostelObj.availableRooms?.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5 text-emerald-400" />
                    Select Room (Optional - or auto-assigned)
                  </label>
                  <select
                    value={regData.roomId}
                    onChange={(e) => setRegData({ ...regData, roomId: e.target.value })}
                    className="block w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Auto-assign available room spot</option>
                    {selectedHostelObj.availableRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Room {r.roomNumber} (Floor {r.floor}, {r.type}) — {r.availableSpots} spots left
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Emergency Contact & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="tel"
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      placeholder="+91 98765 00000"
                      className="block w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Emergency Contact
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="tel"
                      value={regData.emergencyContact}
                      onChange={(e) => setRegData({ ...regData, emergencyContact: e.target.value })}
                      placeholder="Parent/Guardian Contact"
                      className="block w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Allocating Hostel & Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration & Enter Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-xs text-slate-400 pt-2">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('student')}
                  className="font-bold text-emerald-400 hover:underline"
                >
                  Sign In as Student here →
                </button>
              </div>
            </form>
          )}

          {/* Quick test credentials guide */}
          <div className="mt-6 pt-4 border-t border-slate-700/80 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Default Demo Credentials:</div>
            <div>• <span className="text-purple-300 font-medium">Student:</span> student1@hms.com / Student@123</div>
            <div>• <span className="text-emerald-300 font-medium">Warden:</span> warden.boys@hms.com / Warden@123</div>
            <div>• <span className="text-blue-300 font-medium">Admin:</span> admin@hms.com / Admin@123</div>
          </div>
        </div>
      </div>
    </div>
  );
};
