import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Users,
  BedDouble,
  ShieldAlert,
  CheckCircle2,
  X,
  Loader2,
  MapPin
} from 'lucide-react';

export const HostelManagement = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'BOYS',
    totalFloors: 3,
    description: '',
    address: ''
  });

  const fetchHostels = () => {
    setLoading(true);
    api.get('/hostels')
      .then(res => {
        setHostels(res.data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleOpenAdd = () => {
    setEditingHostel(null);
    setFormData({
      name: '',
      code: '',
      type: 'BOYS',
      totalFloors: 3,
      description: '',
      address: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (hostel) => {
    setEditingHostel(hostel);
    setFormData({
      name: hostel.name,
      code: hostel.code,
      type: hostel.type,
      totalFloors: hostel.totalFloors,
      description: hostel.description || '',
      address: hostel.address || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingHostel) {
        await api.put(`/hostels/${editingHostel.id}`, {
          ...formData,
          totalFloors: parseInt(formData.totalFloors, 10)
        });
      } else {
        await api.post('/hostels', {
          ...formData,
          totalFloors: parseInt(formData.totalFloors, 10)
        });
      }
      setModalOpen(false);
      fetchHostels();
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete hostel "${name}"?`)) return;
    try {
      await api.delete(`/hostels/${id}`);
      fetchHostels();
    } catch (err) {
      alert(err.message || 'Cannot delete hostel');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hostel Management</h2>
          <p className="text-xs text-slate-600">Configure residential buildings, capacity specifications, and floor layouts</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Hostel Block</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hostels.map(hostel => (
            <div key={hostel.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{hostel.name}</h3>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {hostel.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          hostel.type === 'BOYS'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : hostel.type === 'GIRLS'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {hostel.type} HOSTEL
                        </span>
                        <span className="text-xs text-slate-600">• {hostel.totalFloors} Floors</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(hostel)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Hostel"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(hostel.id, hostel.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Delete Hostel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-600 line-clamp-2">
                  {hostel.description || 'No description provided.'}
                </p>

                {hostel.address && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="truncate">{hostel.address}</span>
                  </div>
                )}

                {/* Capacity stats */}
                <div className="mt-5 grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-600">Total Rooms</div>
                    <div className="text-sm font-bold text-slate-800">{hostel.totalRooms}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-600">Bed Capacity</div>
                    <div className="text-sm font-bold text-slate-800">{hostel.totalCapacity}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-600">Occupancy</div>
                    <div className="text-sm font-bold text-indigo-600">{hostel.occupancyRate}%</div>
                  </div>
                </div>

                {/* Assigned Wardens list */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Supervising Wardens:
                  </div>
                  {hostel.wardens?.length > 0 ? (
                    <div className="space-y-1.5">
                      {hostel.wardens.map(w => (
                        <div key={w.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <div>
                            <span className="font-semibold text-slate-800">{w.name}</span>
                            <span className="text-slate-600 ml-1.5 text-[11px]">({w.designation})</span>
                          </div>
                          <span className="text-[10px] font-medium text-slate-600">{w.phone}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-amber-600 italic">No warden currently assigned</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingHostel ? 'Edit Hostel Block' : 'Add New Hostel Block'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hostel Block Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryabhatta Hall of Residence"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hostel Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BH-A"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hostel Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="BOYS">Boys Hostel</option>
                    <option value="GIRLS">Girls Hostel</option>
                    <option value="COED">Co-Ed Hostel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Floors</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  required
                  value={formData.totalFloors}
                  onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Address</label>
                <input
                  type="text"
                  placeholder="e.g. North Campus, Sector 4"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Hostel facilities, student intake capacity, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  <span>{editingHostel ? 'Save Changes' : 'Create Hostel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
