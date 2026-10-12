import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  BedDouble,
  AlertCircle,
  CheckCircle2,
  Server,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const [backendStatus, setBackendStatus] = useState({ loading: true, data: null, error: null });
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    api.get('/health')
      .then((res) => {
        setBackendStatus({ loading: false, data: res.data, error: null });
      })
      .catch((err) => {
        setBackendStatus({ loading: false, data: null, error: err.message });
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Production-Quality Full-Stack Hostel Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Hostel Operations & Resident Services System
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            A secure full-stack web application with role-based portals for college administrators,
            warden supervisors, and student residents. Featuring an interactive 4-column compact room grid,
            instant leave passes, and maintenance ticketing.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span>Sign In with 1-Click Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {isAuthenticated && (
              <Link
                to={role === 'ADMIN' ? '/admin' : role === 'WARDEN' ? '/warden' : '/student'}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all"
              >
                <span>Enter Your {role} Workspace</span>
              </Link>
            )}
          </div>
        </div>

        {/* Backend API Connection Status Bar */}
        <div className="mt-10 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Server className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Backend REST API Engine
              </div>
              <div className="text-xs font-mono text-slate-200">
                Prisma ORM • Express.js • JWT Security
              </div>
            </div>
          </div>

          <div>
            {backendStatus.loading ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Verifying backend service...
              </span>
            ) : backendStatus.error ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Backend offline ({backendStatus.error})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Database Connected & Healthy
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Role Portals Architecture Section */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-black text-slate-900">Configured Role Architecture</h2>
          <p className="text-xs text-slate-500 mt-1">
            Tailored dashboards with role-based access control, purpose-built workflows, and instant demo access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Admin Block */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Administrator Portal</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Campus-wide building management, supervisor staff assignments, room capacity schemes, and macro occupancy analytics.
              </p>
              <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                <div>• Block capacity & floor configurator</div>
                <div>• Primary & alternate warden directory</div>
                <div>• Campus-wide circular broadcast</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">admin@hms.com</span>
              <Link to="/login" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <span>Demo Sign In</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Warden Block */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold mb-4 group-hover:scale-105 transition-transform">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Warden Operations</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Interactive 4-column compact room grid, student roster, 1-click bed allocation, night-out authorization, and complaint ticketing.
              </p>
              <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                <div>• Compact 4-column room grid</div>
                <div>• Instant student room allocation & vacating</div>
                <div>• Night-out pass approval desk</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">warden.boys@hms.com</span>
              <Link to="/login" className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
                <span>Demo Sign In</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Student Block */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Student Residence Portal</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Personal room profile, roommate contact directory, maintenance filing, digital gate out-pass slips, and room relocation requests.
              </p>
              <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                <div>• Roommate card & contact directory</div>
                <div>• Digital out-pass slip with warden stamp</div>
                <div>• Maintenance ticket progress tracker</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">student1@hms.com</span>
              <Link to="/login" className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1">
                <span>Demo Sign In</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
