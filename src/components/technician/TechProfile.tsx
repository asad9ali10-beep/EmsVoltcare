import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Phone, Mail, MapPin, Wrench, Shield, Save, CheckCircle2 } from 'lucide-react';

export const TechProfile: React.FC = () => {
  const { currentUser, updateUserProfile, changePassword, addToast } = useApp();

  if (!currentUser) return null;

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [area, setArea] = useState(currentUser.address);

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      addToast('Name and phone are required.', 'error');
      return;
    }
    updateUserProfile({
      name,
      phone,
      email,
      address: area,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = changePassword(currentPass, newPass);
    if (ok) {
      setCurrentPass('');
      setNewPass('');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Profile & Credentials</h2>
        <p className="text-xs text-slate-500">
          Field duty details and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-900 flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Duty Information
          </h3>

          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile / Duty Phone
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assigned Feeder / Zone Area
              </label>
              <input
                type="text"
                required
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-800 hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change password card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-900 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
                placeholder="Current password"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="New password"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
