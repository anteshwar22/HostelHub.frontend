import React from 'react';
import {
  ShieldAlert,
  Clock,
  Coffee,
  AlertTriangle,
  Flame,
  VolumeX,
  Users,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  FileCheck,
  Ban,
  Droplets,
  UtensilsCrossed
} from 'lucide-react';

export const StudentRules = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-700 text-xs font-bold border border-rose-200 mb-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Mandatory Residential Bylaws & Timings</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Hostel Rules, Regulations & Facility Timings
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          All residents are required to strictly observe the following code of conduct, daily service schedules, and safety protocols.
        </p>
      </div>

      {/* 1. KEY TIMINGS & DAILY SCHEDULE CARD (HIGHLIGHTED) */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/60 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Daily Facility Timings & Mess Schedule</h3>
              <p className="text-xs text-indigo-200">Official operating hours for essential services and dining</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {/* Hot Water */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Droplets className="w-4 h-4" />
                <span>Hot Water Supply</span>
              </div>
              <div className="text-xl font-black text-white">6:00 AM – 8:00 AM</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Morning solar geyser supply across all floors and wings.
              </p>
            </div>

            {/* Lunch */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <UtensilsCrossed className="w-4 h-4" />
                <span>Mess Lunch</span>
              </div>
              <div className="text-xl font-black text-white">11:30 AM – 2:00 PM</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Nutritious 4-course hot lunch in main dining hall.
              </p>
            </div>

            {/* Dinner */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
                <UtensilsCrossed className="w-4 h-4" />
                <span>Mess Dinner</span>
              </div>
              <div className="text-xl font-black text-white">7:30 PM – 9:30 PM</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Evening dinner service. Dining counter closes at 9:30 PM.
              </p>
            </div>

            {/* Curfew / Gate Closing */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Ban className="w-4 h-4" />
                <span>Gate In-Time</span>
              </div>
              <div className="text-xl font-black text-white">9:30 PM Sharp</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Main gate locks at 9:30 PM. Out-pass required for late return.
              </p>
            </div>
          </div>

          {/* Secondary Timings Bar */}
          <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div>• <b className="text-white">Mess Breakfast:</b> 7:30 AM – 9:00 AM</div>
            <div>• <b className="text-white">Evening Tea & Snacks:</b> 5:00 PM – 6:00 PM</div>
            <div>• <b className="text-white">Quiet Study Hours:</b> 10:00 PM – 6:00 AM (Mandatory silence)</div>
          </div>
        </div>
      </div>

      {/* 2. STRICT PROHIBITION POLICIES (RED ALERTS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Anti-Ragging Policy */}
        <div className="p-6 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-xs relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900">
                Zero Tolerance Law
              </span>
              <h3 className="text-lg font-black text-rose-950 mt-1.5">
                Ragging is Strictly Prohibited
              </h3>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-xs text-rose-900 leading-relaxed">
            <p>
              In accordance with the <b>Hon'ble Supreme Court of India</b> and <b>UGC Regulations</b>, ragging in any form—physical, psychological, verbal, or via digital media—is a cognizable criminal offense.
            </p>
            <div className="bg-white/80 p-3 rounded-xl border border-rose-200 font-medium space-y-1">
              <div className="font-bold text-rose-950">Immediate Penal Consequences:</div>
              <div>• Immediate suspension and permanent expulsion from hostel and university.</div>
              <div>• Registration of criminal FIR with local police authorities.</div>
              <div>• Cancellation of admission, scholarships, and degree eligibility.</div>
            </div>
            <p className="text-[11px] text-rose-800 font-semibold pt-1">
              📞 24/7 Anti-Ragging National Toll-Free Helpline: 1800-180-5522 | Warden Office: Immediate Contact
            </p>
          </div>
        </div>

        {/* Smoking, Alcohol & Drugs Prohibition */}
        <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-600 text-white shadow-md">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                Campus Code Violation
              </span>
              <h3 className="text-lg font-black text-amber-950 mt-1.5">
                Smoking & Alcohol Strictly Not Allowed
              </h3>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-xs text-amber-900 leading-relaxed">
            <p>
              The entire campus and hostel premises are designated as a <b>strictly dry and tobacco-free zone</b>. Possession, consumption, or distribution of cigarettes, vapes/e-cigarettes, alcohol, or narcotic substances is totally forbidden.
            </p>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200 font-medium space-y-1">
              <div className="font-bold text-amber-950">Enforcement & Fines:</div>
              <div>• First offense: Mandatory fine of ₹5,000 and formal notification to parents/guardians.</div>
              <div>• Second offense: Immediate rustication from residence with zero fee refund.</div>
              <div>• Intoxicated behavior or possession results in immediate room eviction.</div>
            </div>
            <p className="text-[11px] text-amber-800 font-semibold pt-1">
              Random bag screenings and breathalyzer checks are routinely conducted by security personnel.
            </p>
          </div>
        </div>
      </div>

      {/* 3. ADDITIONAL RULES & REGULATIONS DIRECTORY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          General Residential Guidelines & Bylaws
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-700">
          {/* Quiet Hours */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
              <VolumeX className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Quiet Hours (10:00 PM – 6:00 AM)</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Mandatory silence must be maintained in all wings, rooms, and corridors. Shouting, loud music, or disturbing roommates during late hours is strictly penalized.
              </p>
            </div>
          </div>

          {/* Electrical Equipment */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Prohibited Electrical Appliances</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                For fire safety, high-wattage heating coils, immersion water rods, induction cooktops, and unauthorized heaters are strictly banned. Laptops, study lamps, and mobile chargers are permitted.
              </p>
            </div>
          </div>

          {/* Visitors & Guests */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Visitor & Guest Policy</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Outside visitors, day scholars, and opposite-gender persons are NOT permitted inside resident rooms. Parents and registered visitors may meet in the ground floor lounge with warden authorization.
              </p>
            </div>
          </div>

          {/* Night-Out Passes */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
              <FileCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Night-Out & Leave Approvals</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Leaving the campus overnight requires an approved Night-Out Pass submitted at least 12 hours in advance. Warden verification with guardian is mandatory for undergraduate students.
              </p>
            </div>
          </div>

          {/* Room Cleanliness */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Room Cleanliness & Inspections</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Rooms must be kept clean and tidy. Wardens conduct scheduled and unannounced hygiene and safety inspections. Any damage to furniture or walls will be billed directly to the occupants.
              </p>
            </div>
          </div>

          {/* Emergency & Medical Support */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
              <PhoneCall className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Medical Emergency & First Aid</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                A 24/7 first aid kit is available at the warden's office. For medical emergencies, an on-campus ambulance is stationed at the Health Centre (Ext: 108 / 102).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
