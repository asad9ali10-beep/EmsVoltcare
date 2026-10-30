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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-linear-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 shadow-md shadow-blue-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Admin Operations Dashboard
            </h1>
            <p className="text-blue-200 text-xs font-medium">
              Sub-Division HQ • Feeder & Meter Management
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('generate-bills')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Bills</span>
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs backdrop-blur-xs transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Complaints ({pendingComplaints})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Total Consumers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Consumers</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {totalConsumers}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
            {activeConsumers} active connections
          </div>
        </div>

        {/* Card 2: Total Complaints */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Complaints</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {totalComplaints}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Lifetime logs recorded
          </div>
        </div>

        {/* Card 3: Pending Review */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">Pending Review</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-700 mt-2 font-mono">
              {pendingComplaints}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-amber-800 font-bold">
            Needs action / dispatch
          </div>
        </div>

        {/* Card 4: Resolved Complaints */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Resolved Tickets</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-2 font-mono">
              {resolvedComplaints}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
            {Math.round((resolvedComplaints / (totalComplaints || 1)) * 100)}% resolution rate
          </div>
        </div>

        {/* Card 5: Revenue Collected */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Revenue Collected</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-blue-900 mt-2 font-mono truncate">
              {formatPKR(totalRevenueCollected)}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-blue-700 font-semibold">
            {payments.length} transactions reconciled
          </div>
        </div>

        {/* Card 6: Unpaid Bills Amount */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Unpaid Bills</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-red-600 mt-2 font-mono truncate">
              {formatPKR(unpaidAmount)}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-red-600 font-semibold">
            {unpaidBills.length} outstanding bills
          </div>
        </div>
      </div>

      {/* Middle Grid: Category Distribution & Technician Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-800" />
              Complaints by Category
            </h3>
            <button
              onClick={() => setActiveTab('complaints')}
              className="text-xs font-bold text-blue-800 hover:text-blue-950 cursor-pointer"
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
                    <span className="font-semibold text-slate-800">{cat.name}</span>
                    <span className="font-mono text-slate-600">
                      <strong>{cat.count}</strong> tickets ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className="h-full bg-blue-800 rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technician Active Load */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-800" />
                Linemen Roster
              </h3>
              <button
                onClick={() => setActiveTab('technicians')}
                className="text-xs font-bold text-blue-800 hover:text-blue-950 cursor-pointer"
              >
                Manage →
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-3">
              {technicians.map(t => (
                <div key={t.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{t.area}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {t.activeJobsCount} Active Jobs
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{t.completedJobsCount} completed</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('generate-bills')}
              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
