import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  BedDouble,
  Plus,
  Filter,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2
} from 'lucide-react';

export const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Add Room Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: 1,
    hostelId: '',
    capacity: 2,
    type: 'Standard Double',
    amenities: 'Wi-Fi, Study Desk, Balcony',
    status: 'AVAILABLE'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hostelRes, roomRes] = await Promise.all([
        api.get('/hostels'),
        api.get('/rooms', {
          params: {
            hostelId: selectedHostel || undefined,
            floor: selectedFloor !== '' ? selectedFloor : undefined,
            status: selectedStatus || undefined
          }
        })
      ]);
      setHostels(hostelRes.data);
      setRooms(roomRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedHostel, selectedFloor, selectedStatus]);

  const handleOpenAdd = () => {
    setFormData({
      roomNumber: '',
      floor: 1,
      hostelId: hostels[0]?.id || '',
      capacity: 2,
      type: 'Standard Double',
      amenities: 'Wi-Fi, Study Desk, Wardrobe',
      status: 'AVAILABLE'
    });
    setModalOpen(true);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/rooms', {
        ...formData,
        floor: parseInt(formData.floor, 10),
        capacity: parseInt(formData.capacity, 10)
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to create room');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleMaintenance = async (room) => {
    const nextStatus = room.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
    try {
      await api.put(`/rooms/${room.id}`, { status: nextStatus });
      fetchData();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Room Master Directory</h2>
          <p className="text-xs text-slate-600">Configure room specifications, maintenance flags, and bed capacity limits</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filter by:</span>
        </div>

        <select
          value={selectedHostel}
          onChange={(e) => setSelectedHostel(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Hostels</option>
          {hostels.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>

        <select
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Floors</option>
          <option value="1">Floor 1</option>
          <option value="2">Floor 2</option>
          <option value="3">Floor 3</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="FULL">Full</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>

        {(selectedHostel || selectedFloor || selectedStatus) && (
          <button
            onClick={() => {
              setSelectedHostel('');
              setSelectedFloor('');
              setSelectedStatus('');
            }}
            className="text-xs font-medium text-rose-600 hover:text-rose-800 ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Room Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Room No</th>
                  <th className="px-5 py-3.5">Hostel & Floor</th>
                  <th className="px-5 py-3.5">Occupancy</th>
                  <th className="px-5 py-3.5">Type & Amenities</th>
                  <th className="px-5 py-3.5">Current Occupants</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                      Room {room.roomNumber}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">{room.hostelName}</div>
                      <div className="text-[11px] text-slate-400">Floor {room.floor}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{room.occupied}</span>
                        <span className="text-slate-400">/</span>
                        <span className="font-bold text-slate-600">{room.capacity}</span>
                        <span className="text-[10px] text-slate-500">beds</span>
                      </div>
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            room.occupied >= room.capacity ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (room.occupied / room.capacity) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <div className="font-medium text-slate-800">{room.type}</div>
                      <div className="text-[11px] text-slate-400 truncate">{room.amenities}</div>
                    </td>
                    <td className="px-5 py-4">
                      {room.students?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {room.students.map(s => (
                            <span key={s.id} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-800">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Vacant</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        room.status === 'AVAILABLE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : room.status === 'FULL'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleToggleMaintenance(room)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                          room.status === 'MAINTENANCE'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                        }`}
                      >
                        {room.status === 'MAINTENANCE' ? 'Set Available' : 'Mark Maintenance'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Add New Room</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hostel Block</label>
                <select
                  required
                  value={formData.hostelId}
                  onChange={(e) => setFormData({ ...formData, hostelId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Hostel</option>
                  {hostels.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 204"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Floor Level</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    required
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity (Beds)</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Single Room">Single Room</option>
                    <option value="Standard Double">Standard Double</option>
                    <option value="Deluxe Triple">Deluxe Triple</option>
                    <option value="Four-Bed Suite">Four-Bed Suite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amenities</label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Room</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
