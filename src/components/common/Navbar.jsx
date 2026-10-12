import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, ShieldCheck, ArrowRight, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, role, user } = useAuth();
  const location = useLocation();

  // Hide top public navbar when inside role dashboards or login
  const isDashboard = location.pathname.startsWith('/admin') ||
                      location.pathname.startsWith('/warden') ||
                      location.pathname.startsWith('/student');

  if (isDashboard || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin';
    if (role === 'WARDEN') return '/warden';
    if (role === 'STUDENT') return '/student';
    return '/login';
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">Hostel<span className="text-indigo-600">Hub</span></span>
              <span className="ml-2 text-[10px] uppercase font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                Residence Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Link
                to={getDashboardPath()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to {role} Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Portal</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
