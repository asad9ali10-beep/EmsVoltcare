import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPKR } from '../../utils/tariff';
import { Badge } from '../common/Badge';
import {
  User,
  Phone,
  Mail,
  Home,
  MapPin,
  Lock,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export const ConsumerProfile: React.FC = () => {
  const { currentUser, updateUserProfile, addToast, bills } = useApp();



  if (!currentUser) return null;

  // Profile form state
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [address, setAddress] = useState(currentUser.address);
  const [city, setCity] = useState(currentUser.city);







  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      addToast('Name, phone and email are required.', 'error');
      return;
    }
    updateUserProfile({ name, phone, email, address, city });
  };



  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Profile</h2>
        </div>
      </div>

      {/* Profile Section */}
      <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-blue-300 uppercase tracking-wider text-[11px] font-bold block">Consumer Ref</span>
                <span className="text-base font-mono font-black mt-1 block">{currentUser.consumerNumber || '04-11890-5432'}</span>
              </div>
              <div>
                <span className="text-blue-300 uppercase tracking-wider text-[11px] font-bold block">Meter Serial</span>
                <span className="text-base font-mono font-black mt-1 block">{currentUser.meterNumber || 'MTR-8812'}</span>
              </div>
              <div>
                <span className="text-blue-300 uppercase tracking-wider text-[11px] font-bold block">Tariff Category</span>
                <span className="text-base font-semibold mt-1 block">{currentUser.tariffCategory || 'A-1 Residential'}</span>
              </div>
              <div>
                <span className="text-blue-300 uppercase tracking-wider text-[11px] font-bold block">CNIC</span>
                <span className="text-base font-mono font-black mt-1 block">{currentUser.cnic}</span>
              </div>
            </div>
          </div>

          <div className="max-w-2xl">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-800" />
                Personal Details
              </h3>
              <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Phone</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Address / Area</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          </div>
      </div>
    </div>
  );
};
