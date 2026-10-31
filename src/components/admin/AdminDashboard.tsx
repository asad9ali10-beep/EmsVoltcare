import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatPKR } from '../../utils/tariff';
import { ComplaintCategory } from '../../types';
import {
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  FileText,
  TrendingUp,
  Wrench,
  ArrowRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, complaints, bills, payments, technicians, setActiveTab } = useApp();

  const consumers = users.filter(u => u.role === 'consumer');
  const totalConsumers = consumers.length;
  const activeConsumers = consumers.filter(u => u.active).length;

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;

  // Financial metrics
  const totalRevenueCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const unpaidBills = bills.filter(b => b.status === 'Unpaid' || b.status === 'Overdue');
  const unpaidAmount = unpaidBills.reduce((acc, b) => acc + b.totalCurrentBill, 0);

  // Category breakdown for chart
  const categories: ComplaintCategory[] = [
    'Power outage',
    'Voltage fluctuation',
    'Meter fault',
    'Wrong bill',
    'Damaged pole/wire',
    'Other',
  ];

  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: complaints.filter(c => c.category === cat).length,
  }));

  const maxCatCount = Math.max(...categoryCounts.map(c => c.count), 1);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Banner with subtle navy-to-electric-blue gradient & decorative electric circuit */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0C1E36] via-[#142D4E] to-[#1A4278] text-white p-6 sm:p-7 shadow-[0_12px_36px_rgba(20,45,78,0.16)] relative overflow-hidden border border-white/10">
        {/* Ambient electric glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 w-60 h-60 bg-[#2878F0]/25 rounded-full blur-3xl animate-electric-pulse" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 w-60 h-60 bg-[#48C6E8]/18 rounded-full blur-3xl animate-electric-pulse" />

        {/* Decorative electric circuit lines SVG overlay */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 240"
          preserveAspectRatio="none"
        >
          <path
            d="M -20,120 L 180,120 L 230,70 L 480,70 L 530,140 L 820,140"
            fill="none"
            stroke="#48C6E8"
            strokeWidth="1.5"
            strokeDasharray="8 12"
            className="animate-energy-dash"
          />
          <path
            d="M 60,220 L 320,220 L 360,180 L 640,180 L 700,90 L 820,90"
            fill="none"
            stroke="#2878F0"
            strokeWidth="1"
            strokeDasharray="6 14"
            className="animate-energy-dash"
          />
          <circle cx="230" cy="70" r="3" fill="#FFC857" opacity="0.8" />
          <circle cx="530" cy="140" r="3" fill="#48C6E8" opacity="0.8" />
        </svg>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-[#FFC857] border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#48C6E8] animate-pulse" />
              <span>Grid Control Center • Live Monitoring</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Admin Operations Dashboard
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              Sub-Division HQ • Feeder & Meter Management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('billing-revenue')}
              className="px-4 py-2.5 bg-[#FFC857] hover:bg-[#ffbe38] text-[#142D4E] font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#FFC857]/20 hover:shadow-lg hover:shadow-[#FFC857]/30 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Billing & Revenue</span>
            </button>
            <button
              onClick={() => setActiveTab('operations')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-xs sm:text-sm backdrop-blur-md transition-all duration-200 border border-white/20 hover:border-white/35 flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-[#FFC857]" />
              <span>Complaints ({pendingComplaints})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Total Consumers */}
        <div className="card-premium flex flex-col justify-between p-4 animate-fade-in-up delay-75">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8491A5]">Total Consumers</span>
              <div className="w-8 h-8 rounded-lg bg-[#2878F0]/10 text-[#2878F0] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#142D4E] mt-2 font-mono">
              {totalConsumers}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-semibold">
            {activeConsumers} active connections
          </div>
        </div>

        {/* Card 2: Total Complaints */}
        <div className="card-premium flex flex-col justify-between p-4 animate-fade-in-up delay-150">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8491A5]">Total Complaints</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#172B45] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#142D4E] mt-2 font-mono">
              {totalComplaints}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#8491A5] font-medium">
            Lifetime logs recorded
          </div>
        </div>

        {/* Card 3: Pending Review */}
        <div className="card-premium flex flex-col justify-between p-4 border-amber-200/80 bg-amber-50/15 animate-fade-in-up delay-225">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Pending Review</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-700 mt-2 font-mono">
              {pendingComplaints}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-amber-800 font-bold">
            Needs dispatch
          </div>
        </div>

        {/* Card 4: Resolved Complaints */}
        <div className="card-premium flex flex-col justify-between p-4 animate-fade-in-up delay-75">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8491A5]">Resolved Tickets</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-2 font-mono">
              {resolvedComplaints}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-semibold">
            {Math.round((resolvedComplaints / (totalComplaints || 1)) * 100)}% resolution rate
          </div>
        </div>

        {/* Card 5: Revenue Collected */}
        <div className="card-premium flex flex-col justify-between p-4 animate-fade-in-up delay-150">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8491A5]">Revenue Collected</span>
              <div className="w-8 h-8 rounded-lg bg-[#2878F0]/10 text-[#2878F0] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-[#142D4E] mt-2 font-mono truncate">
              {formatPKR(totalRevenueCollected)}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#2878F0] font-semibold">
            {payments.length} reconciled
          </div>
        </div>

        {/* Card 6: Unpaid Bills Amount */}
        <div className="card-premium flex flex-col justify-between p-4 animate-fade-in-up delay-225">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8491A5]">Unpaid Bills</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-rose-600 mt-2 font-mono truncate">
              {formatPKR(unpaidAmount)}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-rose-600 font-semibold">
            {unpaidBills.length} outstanding
          </div>
        </div>
      </div>

      {/* Middle Grid: Category Distribution & Technician Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(20,45,78,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#142D4E] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2878F0]" />
              Complaints by Category
            </h3>
            <button
              onClick={() => setActiveTab('operations')}
              className="text-xs font-bold text-[#2878F0] hover:text-[#1f64d0] cursor-pointer transition-colors"
            >
              View Table →
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {categoryCounts.map(cat => {
              const percent = Math.round((cat.count / (totalComplaints || 1)) * 100);
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#172B45]">{cat.name}</span>
                    <span className="font-mono text-[#8491A5]">
                      <strong className="text-[#142D4E]">{cat.count}</strong> tickets ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F6F8FC] rounded-full overflow-hidden border border-slate-100">
                    <div
                      style={{ width: `${percent}%` }}
                      className="h-full bg-[#2878F0] rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technician Active Load */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(20,45,78,0.03)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#142D4E] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#2878F0]" />
                Linemen Roster
              </h3>
              <button
                onClick={() => setActiveTab('operations')}
                className="text-xs font-bold text-[#2878F0] hover:text-[#1f64d0] cursor-pointer transition-colors"
              >
                Manage →
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-3">
              {technicians.map(t => (
                <div key={t.id} className="py-2.5 flex items-center justify-between hover:bg-[#F6F8FC] px-1 rounded-lg transition-colors">
                  <div>
                    <div className="text-xs font-bold text-[#142D4E]">{t.name}</div>
                    <div className="text-[11px] text-[#8491A5] truncate max-w-[150px]">{t.area}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFC857]/25 text-[#946200] border border-[#FFC857]/40">
                      {t.activeJobsCount} Active
                    </span>
                    <div className="text-[10px] text-[#8491A5] font-mono mt-0.5">{t.completedJobsCount} done</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('billing-revenue')}
              className="w-full py-2.5 bg-[#2878F0]/10 hover:bg-[#2878F0]/15 text-[#2878F0] font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Billing Generator Hub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
