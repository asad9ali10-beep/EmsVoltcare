import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  Lock,
  Mail,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, registerConsumer, addToast } = useApp();

  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regCnic, setRegCnic] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Islamabad');
  const [regMeter, setRegMeter] = useState('');
  const [regPassword, setRegPassword] = useState('1234');



  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your email address.', 'error');
      return;
    }
    login(email, password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!regName.trim() || !regCnic.trim() || !regPhone.trim() || !regEmail.trim()) {
      addToast('Please fill all required fields.', 'error');
      return;
    }

    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    if (regPassword.length < 4) {
      addToast('Password must be at least 4 characters.', 'error');
      return;
    }

    registerConsumer({
      name: regName,
      cnic: regCnic,
      phone: regPhone,
      email: regEmail,
      address: regAddress || 'Street 1, Main Boulevard',
      city: regCity,
      meterNumber: regMeter || `MTR-${Math.floor(1000 + Math.random() * 9000)}`,
      password: regPassword,
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle electricity ambient light gradients */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 bg-[#2878F0]/8 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-80 h-80 bg-[#48C6E8]/8 rounded-full blur-3xl" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#142D4E] text-[#FFC857] shadow-lg shadow-[#142D4E]/15 mb-3 transition-transform hover:scale-105 duration-300">
          <Zap className="w-7 h-7 fill-[#FFC857]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] tracking-tight">
          PowerLink
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#8491A5] font-medium">
          Electricity Management System
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-[0_8px_30px_rgb(20,45,78,0.06)] rounded-2xl border border-slate-200/80 animate-fade-in-up">
          
          {/* Form Switching */}
          {!isRegistering ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B45] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#8491A5]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-[#172B45] placeholder-[#8491A5] focus:outline-none focus:border-[#2878F0] focus:ring-2 focus:ring-[#2878F0]/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B45] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#8491A5]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-[#172B45] placeholder-[#8491A5] focus:outline-none focus:border-[#2878F0] focus:ring-2 focus:ring-[#2878F0]/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#8491A5] hover:text-[#172B45] cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-[#2878F0] hover:bg-[#1f64d0] active:scale-[0.99] shadow-sm hover:shadow-md hover:shadow-[#2878F0]/25 text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-3 text-center border-t border-slate-100">
                <p className="text-xs text-[#8491A5]">
                  New consumer?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="font-bold text-[#2878F0] hover:text-[#1f64d0] hover:underline cursor-pointer"
                  >
                    Register Connection
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Consumer Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#142D4E]">New Consumer Registration</h3>
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-xs font-semibold text-blue-800 hover:underline cursor-pointer"
                >
                  Sign In Instead
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B45] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="e.g. Tariq Mahmood"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-[#172B45] focus:outline-none focus:border-[#2878F0] focus:ring-2 focus:ring-[#2878F0]/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#172B45] mb-1">
                    CNIC *
                  </label>
                  <input
                    type="text"
                    required
                    value={regCnic}
                    onChange={e => setRegCnic(e.target.value)}
                    placeholder="35202-1234567-1"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-[#172B45] focus:outline-none focus:border-[#2878F0] focus:ring-2 focus:ring-[#2878F0]/20 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B45] mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-[#172B45] focus:outline-none focus:border-[#2878F0] focus:ring-2 focus:ring-[#2878F0]/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#172B45] mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-[#172B45] focus:outline-none focus:border-[#2878F0] focus:ring-2 focus:ring-[#2878F0]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B45] mb-1">
                    City *
                  </label>
                  <select
                    value={regCity}
                    onChange={e => setRegCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-[#172B45] focus:outline-none focus:border-[#2878F0] focus:ring-2 focus:ring-[#2878F0]/20 transition-all"
                  >
                    <option>Islamabad</option>
                    <option>Rawalpindi</option>
                    <option>Lahore</option>
                    <option>Karachi</option>
                    <option>Peshawar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B45] mb-1">
                  Premises Address *
                </label>
                <input
                  type="text"
                  required
                  value={regAddress}
                  onChange={e => setRegAddress(e.target.value)}
                  placeholder="House 42-B, Sector G-11/2"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-[#172B45] focus:outline-none focus:border-[#2878F0] focus:ring-2 focus:ring-[#2878F0]/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#172B45] mb-1">
                    Meter Serial (Optional)
                  </label>
                  <input
                    type="text"
                    value={regMeter}
                    onChange={e => setRegMeter(e.target.value)}
                    placeholder="MTR-8812"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-[#172B45] focus:outline-none focus:border-[#2878F0] focus:ring-2 focus:ring-[#2878F0]/20 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B45] mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-[#172B45] focus:outline-none focus:border-[#2878F0] focus:ring-2 focus:ring-[#2878F0]/20 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-[#2878F0] hover:bg-[#1f64d0] active:scale-[0.99] shadow-sm hover:shadow-md hover:shadow-[#2878F0]/25 text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Register Account</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Clean Launch Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          PowerLink EMS • 24/7 Helpline: <strong className="text-slate-600 font-mono">118</strong>
        </div>
      </div>
    </div>
  );
};
