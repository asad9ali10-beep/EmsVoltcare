import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { Badge } from '../common/Badge';
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Power,
  PowerOff,
  Check,
  X,
  Gauge,
  Phone,
  Mail,
  Home,
  ShieldCheck,
} from 'lucide-react';

export const AdminConsumers: React.FC = () => {
  const { users, addConsumer, updateConsumer, toggleConsumerActive, showConfirmDialog, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<string>('All');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingConsumer, setEditingConsumer] = useState<User | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [meterNumber, setMeterNumber] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [tariffCategory, setTariffCategory] = useState('A-1 Residential (Single Phase)');

  const consumers = users.filter(u => u.role === 'consumer');

  const filteredConsumers = consumers.filter(c => {
    if (filterActive === 'Active' && !c.active) return false;
    if (filterActive === 'Inactive' && c.active) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.consumerNumber && c.consumerNumber.toLowerCase().includes(q)) ||
        (c.meterNumber && c.meterNumber.toLowerCase().includes(q)) ||
        c.cnic.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingConsumer(null);
    setName('');
    setEmail('');
    setPhone('');
    setCnic('');
    setAddress('');
    setCity('Islamabad');
    setMeterNumber(`MTR-${Math.floor(1000 + Math.random() * 9000)}`);
    setConsumerNumber(`04-${Math.floor(10000 + Math.random() * 90000)}-01`);
    setTariffCategory('A-1 Residential (Single Phase)');
    setShowModal(true);
  };

  const handleOpenEdit = (consumer: User) => {
    setEditingConsumer(consumer);
    setName(consumer.name);
    setEmail(consumer.email);
    setPhone(consumer.phone);
    setCnic(consumer.cnic);
    setAddress(consumer.address);
    setCity(consumer.city);
    setMeterNumber(consumer.meterNumber || '');
    setConsumerNumber(consumer.consumerNumber || '');
    setTariffCategory(consumer.tariffCategory || 'A-1 Residential (Single Phase)');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !cnic.trim()) {
      addToast('Please fill all required consumer details.', 'error');
      return;
    }

    if (!email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    if (editingConsumer) {
      updateConsumer({
        ...editingConsumer,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        cnic: cnic.trim(),
        address: address.trim(),
        city,
        meterNumber: meterNumber.trim(),
        consumerNumber: consumerNumber.trim(),
        tariffCategory,
      });
    } else {
      addConsumer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        cnic: cnic.trim(),
        address: address.trim() || 'Sector G-11/2',
        city,
        meterNumber: meterNumber.trim(),
        consumerNumber: consumerNumber.trim(),
        tariffCategory,
        active: true,
        password: '1234',
      });
    }
    setShowModal(false);
  };

  const handleToggle = (consumer: User) => {
    showConfirmDialog({
      title: `${consumer.active ? 'Deactivate' : 'Activate'} Consumer Connection?`,
      message: `Are you sure you want to ${consumer.active ? 'deactivate meter power delivery for' : 're-activate connection for'} ${consumer.name} (#${consumer.consumerNumber})?`,
      confirmLabel: consumer.active ? 'Deactivate Meter' : 'Activate Meter',
      isDanger: consumer.active,
      onConfirm: () => toggleConsumerActive(consumer.id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Consumer Directory</h2>
          <p className="text-xs text-slate-500">
            Active connections and meter records
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Consumer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search consumer, CNIC, meter #, consumer ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          {['All', 'Active', 'Inactive'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterActive(tab)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filterActive === tab
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Consumers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Consumer Account</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">CNIC Number</th>
                <th className="py-3.5 px-4">Meter Serial</th>
                <th className="py-3.5 px-4">Tariff Category</th>
                <th className="py-3.5 px-4">Address & City</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredConsumers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No consumers found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredConsumers.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] font-mono text-blue-900 font-semibold">
                        ID: {c.consumerNumber}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap space-y-0.5">
                      <div className="text-slate-700">{c.phone}</div>
                      <div className="text-[11px] text-slate-400">{c.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {c.cnic}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {c.meterNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {c.tariffCategory}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {c.address}, {c.city}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <Badge status={c.active ? 'Active' : 'Inactive'} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-slate-600 hover:text-blue-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Consumer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggle(c)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            c.active
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={c.active ? 'Deactivate Connection' : 'Activate Connection'}
                        >
                          {c.active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Consumer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingConsumer ? 'Edit Consumer Connection' : 'Register New Electricity Consumer'}
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
                  Full Name (as per CNIC) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CNIC *
                  </label>
                  <input
                    type="text"
                    required
                    value={cnic}
                    onChange={e => setCnic(e.target.value)}
                    placeholder="35202-1234567-1"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  >
                    <option>Islamabad</option>
                    <option>Rawalpindi</option>
                    <option>Lahore</option>
                    <option>Karachi</option>
                    <option>Peshawar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Meter Serial Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={meterNumber}
                    onChange={e => setMeterNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Consumer Account ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={consumerNumber}
                    onChange={e => setConsumerNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tariff Category *
                </label>
                <select
                  value={tariffCategory}
                  onChange={e => setTariffCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  <option>A-1 Residential (Single Phase)</option>
                  <option>A-1 Residential (Three Phase)</option>
                  <option>A-2 Commercial</option>
                  <option>B-1 General Industrial</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Premises Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="House 42, Street 10..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
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
                  {editingConsumer ? 'Save Changes' : 'Create Consumer Connection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
