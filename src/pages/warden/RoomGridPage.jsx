import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  BedDouble,
  Users,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  UserMinus,
  X,
  Loader2,
  Wrench,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';

export const RoomGridPage = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [unallocatedStudents, setUnallocatedStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedFloor, setSelectedFloor] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected room for slide-over drawer
  const [activeRoom, setActiveRoom] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Allocation state in drawer
  const [selectedStudentToAllocate, setSelectedStudentToAllocate] = useState('');
  const [allocationBedName, setAllocationBedName] = useState('');
  const [allocating, setAllocating] = useState(false);

  const fetchRoomsAndStudents = async () => {
    setLoading(true);
    try {
      const hostelId = user?.wardenProfile?.hostelId;
      const [roomsRes, studentsRes] = await Promise.all([
        api.get('/rooms', { params: { hostelId } }),
        api.get('/students', { params: { hostelId, status: 'UNALLOCATED' } })
      ]);
      setRooms(roomsRes.data);
      setUnallocatedStudents(studentsRes.data);

      // Refresh activeRoom data if open
      if (activeRoom) {
        const freshActive = roomsRes.data.find(r => r.id === activeRoom.id);
        if (freshActive) setActiveRoom(freshActive);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomsAndStudents();
  }, [user]);

  // Open Room Drawer
  const handleOpenRoomDrawer = (room) => {
    setActiveRoom(room);
    setSelectedStudentToAllocate('');
    setAllocationBedName(`Bed ${room.occupied + 1}`);
    setDrawerOpen(true);
  };

  // Allocate Student
  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!selectedStudentToAllocate || !activeRoom) return;
    setAllocating(true);
    try {
      await api.post('/rooms/allocate', {
        studentProfileId: selectedStudentToAllocate,
        hostelId: activeRoom.hostelId,
        roomId: activeRoom.id,
        bedNumber: allocationBedName || `Bed ${activeRoom.occupied + 1}`
      });
      setSelectedStudentToAllocate('');
      await fetchRoomsAndStudents();
    } catch (err) {
      alert(err.message || 'Allocation failed');
    } finally {
      setAllocating(false);
    }
  };

  // Vacate Student
  const handleVacate = async (studentProfileId, studentName) => {
    if (!window.confirm(`Vacate ${studentName} from this room?`)) return;
    try {
      await api.post('/rooms/vacate', { studentProfileId });
      await fetchRoomsAndStudents();
    } catch (err) {
      alert(err.message || 'Failed to vacate student');
    }
  };

  // Toggle Maintenance
  const handleToggleMaintenance = async () => {
    if (!activeRoom) return;
    const nextStatus = activeRoom.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
    try {
      await api.put(`/rooms/${activeRoom.id}`, { status: nextStatus });
      await fetchRoomsAndStudents();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesFloor = selectedFloor === 'ALL' || r.floor.toString() === selectedFloor;
    const matchesStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'AVAILABLE' && r.status === 'AVAILABLE' && r.occupied < r.capacity) ||
      (selectedStatus === 'FULL' && (r.status === 'FULL' || r.occupied >= r.capacity)) ||
      (selectedStatus === 'MAINTENANCE' && r.status === 'MAINTENANCE');
    const matchesSearch =
      searchQuery === '' ||
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.students.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFloor && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Interactive Room Grid</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              4-Column View
            </span>
          </div>
          <p className="text-xs text-slate-600">Real-time compact bed occupancy matrix with instant click-to-allocate drawer</p>
        </div>

        {/* Unallocated students indicator */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
          <Users className="w-4 h-4 text-amber-600" />
          <span><b>{unallocatedStudents.length}</b> unallocated students awaiting rooms</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Floor tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            {['ALL', '1', '2', '3'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFloor(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedFloor === f
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f === 'ALL' ? 'All Floors' : `Floor ${f}`}
              </button>
            ))}
          </div>

          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available / Vacant</option>
            <option value="FULL">Fully Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search room no or student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-600 px-1 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-500" />
          <span>Vacant Beds Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-blue-600" />
          <span>Fully Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-amber-500" />
          <span>Partially Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-rose-500" />
          <span>Maintenance Flagged</span>
        </div>
      </div>

      {/* 4-Column Compact Room Grid */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <BedDouble className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-sm">No rooms match the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const isFull = room.occupied >= room.capacity;
            const isMaintenance = room.status === 'MAINTENANCE';
            const isPartial = room.occupied > 0 && room.occupied < room.capacity;

            let cardBorder = 'border-slate-200 hover:border-emerald-400';
            let headerBg = 'bg-slate-50';
            let statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            let statusText = `${room.vacantBeds} Vacant`;

            if (isMaintenance) {
              cardBorder = 'border-rose-200 bg-rose-50/20 hover:border-rose-400';
              headerBg = 'bg-rose-50';
              statusBadge = 'bg-rose-100 text-rose-800 border-rose-200';
              statusText = 'Under Repair';
            } else if (isFull) {
              cardBorder = 'border-blue-200 hover:border-blue-400';
              headerBg = 'bg-blue-50/60';
              statusBadge = 'bg-blue-100 text-blue-800 border-blue-200';
              statusText = 'Full';
            } else if (isPartial) {
              cardBorder = 'border-amber-200 hover:border-amber-400';
              headerBg = 'bg-amber-50/40';
              statusBadge = 'bg-amber-100 text-amber-800 border-amber-200';
              statusText = `${room.vacantBeds} Left`;
            }

            return (
              <div
                key={room.id}
                onClick={() => handleOpenRoomDrawer(room)}
                className={`bg-white rounded-2xl border ${cardBorder} shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden group`}
              >
                {/* Card Header */}
                <div className={`p-3.5 border-b border-slate-100 flex items-center justify-between ${headerBg}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-base">
                      Room {room.roomNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      F{room.floor}
                    </span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${statusBadge}`}>
                    {statusText}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-3.5 space-y-3 flex-1">
                  {/* Bed slot indicators */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Beds:</span>
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: room.capacity }).map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-3 h-3 rounded-full border ${
                            idx < room.occupied
                              ? isFull
                                ? 'bg-blue-600 border-blue-700'
                                : 'bg-amber-500 border-amber-600'
                              : 'bg-emerald-100 border-emerald-300'
                          }`}
                          title={idx < room.occupied ? 'Occupied Bed' : 'Vacant Bed'}
                        />
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-1">
                        {room.occupied}/{room.capacity}
                      </span>
                    </div>
                  </div>

                  {/* Occupants list */}
                  <div className="space-y-1.5">
                    {room.students?.length > 0 ? (
                      room.students.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <div className="truncate">
                            <div className="font-semibold text-slate-800 text-[11px] truncate">{st.name}</div>
                            <div className="text-[10px] text-slate-600 truncate">{st.studentId} • {st.department}</div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-600 shrink-0 bg-white px-1 py-0.5 rounded border border-slate-200 ml-1">
                            {st.bedNumber || 'Bed'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-[11px] text-slate-600 italic bg-emerald-50/40 rounded-lg border border-dashed border-emerald-200">
                        Room completely vacant
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Quick Action */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center text-[11px] font-semibold text-slate-600 group-hover:text-emerald-700 transition-colors">
                  Click to manage & allocate →
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Room Drawer / Slide-Over Modal */}
      {drawerOpen && activeRoom && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 animate-in slide-in-from-right duration-200">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">Room {activeRoom.roomNumber}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Floor {activeRoom.floor}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{activeRoom.type} • {activeRoom.amenities}</p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Maintenance toggle */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Status: {activeRoom.status}</div>
                  <div className="text-[11px] text-slate-600">
                    Occupancy: {activeRoom.occupied} of {activeRoom.capacity} beds filled
                  </div>
                </div>
                <button
                  onClick={handleToggleMaintenance}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    activeRoom.status === 'MAINTENANCE'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{activeRoom.status === 'MAINTENANCE' ? 'Clear Repair' : 'Set Maintenance'}</span>
                </button>
              </div>

              {/* Current Occupants List with Vacate Action */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                  Current Occupants ({activeRoom.students?.length || 0})
                </h4>

                {activeRoom.students?.length > 0 ? (
                  <div className="space-y-2">
                    {activeRoom.students.map((st) => (
                      <div
                        key={st.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{st.name}</div>
                          <div className="text-[11px] text-slate-600">
                            {st.studentId} • {st.department} • <b className="text-slate-800">{st.bedNumber || 'Bed'}</b>
                          </div>
                          {st.phone && <div className="text-[10px] text-slate-600">📞 {st.phone}</div>}
                        </div>
                        <button
                          onClick={() => handleVacate(st.id, st.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Vacate student from room"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 italic py-2">No students currently in this room.</p>
                )}
              </div>

              {/* Allocate New Student Section */}
              {activeRoom.occupied < activeRoom.capacity && activeRoom.status !== 'MAINTENANCE' && (
                <div className="mt-6 pt-5 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5 text-emerald-700">
                    <UserPlus className="w-4 h-4" />
                    Allocate Student into Vacant Bed
                  </h4>

                  <form onSubmit={handleAllocate} className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Select Unallocated Student
                      </label>
                      <select
                        required
                        value={selectedStudentToAllocate}
                        onChange={(e) => setSelectedStudentToAllocate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">-- Choose student --</option>
                        {unallocatedStudents.map((us) => (
                          <option key={us.id} value={us.id}>
                            {us.name} ({us.studentId} - {us.department})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Bed Designation
                      </label>
                      <input
                        type="text"
                        required
                        value={allocationBedName}
                        onChange={(e) => setAllocationBedName(e.target.value)}
                        placeholder="e.g. Bed 1, Bed A"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={allocating || !selectedStudentToAllocate}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-60 flex items-center justify-center gap-1.5"
                    >
                      {allocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                      <span>Confirm Room Allocation</span>
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
