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
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  UserCheck,
  ShieldCheck,
  Loader2
} from 'lucide-react';

export const WardenDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/analytics/warden')
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
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
        <h3 className="font-bold">Failed to load warden analytics</h3>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Warden Residential Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {data.hostel?.name}
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Oversee room occupancy, manage student admissions, approve leave & night-out passes, and resolve facility maintenance complaints.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/warden/rooms"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-emerald-600/30"
            >
              <BedDouble className="w-4 h-4" />
              <span>Interactive 4-Col Room Grid</span>
            </Link>
            <Link
              to="/warden/students"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Student Roster</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Hostel Capacity</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{data.occupancyRate}%</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {data.totalOccupied} / {data.totalCapacity} Beds
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            <span className="font-semibold text-emerald-700">{data.availableBeds} beds</span> currently available
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Enrolled Residents</span>
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{data.studentCount}</span>
            <span className="text-xs text-slate-600">Assigned Students</span>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            Across {data.totalRooms} configured hostel rooms
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Night-Out Passes</span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{data.pendingNightOuts}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              Awaiting Approval
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            <Link to="/warden/night-out" className="text-emerald-700 font-semibold hover:underline">
              Review pending pass slips →
            </Link>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Complaints</span>
            <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {(data.complaintsSummary?.OPEN || 0) + (data.complaintsSummary?.IN_PROGRESS || 0)}
            </span>
            <span className="text-xs text-slate-600">Open Tickets</span>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            <span className="font-semibold text-emerald-700">{data.complaintsSummary?.RESOLVED || 0}</span> resolved
          </div>
        </div>
      </div>

      {/* Floor-wise Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Floor-wise Occupancy Distribution</h3>
        <p className="text-xs text-slate-600 mb-6">Real-time room occupancy and capacity breakdown by building level</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.floorStats?.map((floor) => {
            const occRate = floor.capacity > 0 ? Math.round((floor.occupied / floor.capacity) * 100) : 0;
            return (
              <div key={floor.floor} className="p-5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Floor {floor.floor}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {occRate}%
                  </span>
                </div>
                <div className="mt-3">
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${Math.min(100, occRate)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                    <span>Rooms: <b className="text-slate-800">{floor.totalRooms}</b></span>
                    <span>Beds: <b className="text-slate-800">{floor.occupied}/{floor.capacity}</b></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/warden/rooms"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-105 transition-transform">
            <BedDouble className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">4-Column Room Grid</h4>
          <p className="mt-1.5 text-xs text-slate-600">
            Interactive visual grid displaying each room's beds, occupant badges, and 1-click allocation drawer.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-emerald-700">
            <span>Open Room Grid</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link
          to="/warden/night-out"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">Night-Out Approval Desk</h4>
          <p className="mt-1.5 text-xs text-slate-600">
            Review destination, dates, and parent contacts. Authorize or reject night-out pass requests with remarks.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-amber-700">
            <span>Manage Passes ({data.pendingNightOuts} Pending)</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link
          to="/warden/complaints"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4 group-hover:scale-105 transition-transform">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">Complaint Resolution</h4>
          <p className="mt-1.5 text-xs text-slate-600">
            Track electrical, plumbing, Wi-Fi, and furniture tickets. Assign technicians and record resolution notes.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-rose-700">
            <span>View Tickets</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
};
