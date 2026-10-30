import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Technician } from '../../types';
import {
  Wrench,
  UserPlus,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Edit,
  Trash2,
  X,
  Shield,
  Briefcase,
} from 'lucide-react';

export const AdminTechnicians: React.FC = () => {
  const { technicians, addTechnician, updateTechnician, deleteTechnician, showConfirmDialog, addToast } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingTech, setEditingTech] = useState<Technician | null>(null);

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [specialization, setSpecialization] = useState('Senior Lineman / Overhead Network');

  const handleOpenAdd = () => {
    setEditingTech(null);
    setName('');
    setEmail('');
    setPhone('');
    setArea('Islamabad North');
    setSpecialization('Senior Lineman / Overhead Network');
    setShowModal(true);
  };

  const handleOpenEdit = (t: Technician) => {
    setEditingTech(t);
    setName(t.name);
    setEmail(t.email);
    setPhone(t.phone);
    setArea(t.area);
    setSpecialization(t.specialization);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !area.trim()) {
      addToast('Please fill all required technician fields.', 'error');
      return;
    }

    if (editingTech) {
      updateTechnician({
        ...editingTech,
        name: name.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@voltcare.pk`,
        phone: phone.trim(),
        area: area.trim(),
        specialization,
      });
    } else {
      addTechnician({
        name: name.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@voltcare.pk`,
        phone: phone.trim(),
        area: area.trim(),
        specialization,
        active: true,
      });
    }

    setShowModal(false);
  };

  const handleDelete = (t: Technician) => {
    showConfirmDialog({
      title: `Remove Lineman ${t.name}?`,
      message: `Are you sure you want to remove ${t.name} from the active technician roster? Any assigned complaints should be reassigned.`,
      confirmLabel: 'Delete Technician',
      isDanger: true,
      onConfirm: () => deleteTechnician(t.id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Field Technicians</h2>
          <p className="text-xs text-slate-500">
            Technical staff directory and workload allocation
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Technician</span>
        </button>
      </div>

      {/* Technicians Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {technicians.map(t => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-black text-sm uppercase">
                    {t.name.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{t.name}</h3>
                    <span className="text-[11px] text-blue-800 font-semibold">{t.specialization}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    title="Edit Lineman"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    title="Remove Lineman"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 font-medium">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{t.area}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{t.phone}</span>
                </div>
              </div>
            </div>

            {/* Workload metrics */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Currently Handling</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="font-bold text-amber-700">{t.activeJobsCount} Active Jobs</span>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Total Completed</span>
                <div className="font-mono font-bold text-slate-800">{t.completedJobsCount} Jobs</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingTech ? 'Edit Lineman Details' : 'Add New Field Lineman'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Kamran Akram"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0302-1234567"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Sub-Division Area *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="e.g. Islamabad North & Sector G/F"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Technical Specialization *
                </label>
                <select
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  <option>Senior Lineman / Overhead Network</option>
                  <option>Digital & Electronic Metering Specialist</option>
                  <option>Distribution Transformers & High Voltage</option>
                  <option>Sub-Station Protection & Earthing</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-xl shadow-xs cursor-pointer"
                >
                  {editingTech ? 'Save Changes' : 'Add Technician'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
