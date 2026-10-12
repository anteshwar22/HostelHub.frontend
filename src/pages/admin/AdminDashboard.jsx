import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Building2,
  Users,
  BedDouble,
  AlertCircle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Plus
} from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/analytics/admin')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
        <h3 className="font-bold">Failed to load analytics</h3>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Campus Residence Administration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Central Hostel Operations Center
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Monitor real-time residential capacity, supervisor assignments, active maintenance tickets, and campus notices across all blocks.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/admin/hostels"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-600/30"
            >
              <Building2 className="w-4 h-4" />
              <span>Manage Hostels</span>
            </Link>
            <Link
              to="/admin/wardens"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Warden Assignments</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Hostels</span>
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{data.totalHostels}</span>
            <span className="text-xs text-slate-600">Residential Blocks</span>
          </div>
          <div className="mt-3 text-xs text-slate-600 flex items-center gap-1">
            <span className="font-semibold text-slate-800">{data.totalRooms}</span> total configured rooms
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Campus Occupancy</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{data.occupancyRate}%</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {data.totalOccupied} / {data.totalCapacity} Beds
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            <span className="font-semibold text-emerald-700">{data.availableBeds} beds</span> currently vacant
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Registered Students</span>
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{data.totalStudents}</span>
            <span className="text-xs text-slate-600">Enrolled Residents</span>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            {data.unallocatedStudents > 0 ? (
              <span className="text-amber-700 font-semibold">{data.unallocatedStudents} awaiting room allocation</span>
            ) : (
              <span className="text-emerald-700 font-semibold">100% Students allocated</span>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Active Complaints</span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {(data.complaintsSummary?.OPEN || 0) + (data.complaintsSummary?.IN_PROGRESS || 0)}
            </span>
            <span className="text-xs text-slate-600">Pending Resolution</span>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            <span className="font-semibold text-emerald-700">{data.complaintsSummary?.RESOLVED || 0}</span> resolved tickets
          </div>
        </div>
      </div>

      {/* Hostel Blocks Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Hostel Blocks & Capacity Distribution</h3>
            <p className="text-xs text-slate-600">Individual block occupancy rates and resident counts</p>
          </div>
          <Link
            to="/admin/hostels"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Hostels</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.hostelBreakdown?.map((hostel) => (
            <div key={hostel.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-base">{hostel.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {hostel.code}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-600 mt-0.5 block">
                    Type: <span className="text-slate-800 font-semibold">{hostel.type}</span> • {hostel.totalRooms} Rooms
                  </span>
                </div>
                <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                  {hostel.occupancyRate}% Full
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, hostel.occupancyRate)}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <span>Occupied: <b className="text-slate-800">{hostel.occupied}</b> beds</span>
                  <span>Available: <b className="text-emerald-700">{hostel.available}</b> beds</span>
                  <span>Capacity: <b className="text-slate-800">{hostel.capacity}</b></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints status breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base mb-4">Complaints Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
              <span className="text-xs font-semibold text-amber-900">Open Tickets</span>
              <span className="text-sm font-bold text-amber-700">{data.complaintsSummary?.OPEN || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-200/60">
              <span className="text-xs font-semibold text-blue-900">In Progress</span>
              <span className="text-sm font-bold text-blue-700">{data.complaintsSummary?.IN_PROGRESS || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
              <span className="text-xs font-semibold text-emerald-900">Resolved</span>
              <span className="text-sm font-bold text-emerald-700">{data.complaintsSummary?.RESOLVED || 0}</span>
            </div>
          </div>
        </div>

        {/* Pending Student Requests */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base mb-4">Pending Student Requests</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Night-Out Passes</div>
                <div className="text-[11px] text-slate-600">Awaiting warden authorization</div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800">
                {data.pendingNightOuts} Pending
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Room Change Requests</div>
                <div className="text-[11px] text-slate-600">Student relocation applications</div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-800">
                {data.pendingRoomChanges} Pending
              </span>
            </div>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base mb-4">Administrative Shortcuts</h3>
          <div className="space-y-2">
            <Link
              to="/admin/hostels"
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Configure Hostels & Floors</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              to="/admin/wardens"
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Assign Warden to Hostel</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              to="/admin/notices"
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-purple-600" />
                <span>Publish Campus Notice</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
