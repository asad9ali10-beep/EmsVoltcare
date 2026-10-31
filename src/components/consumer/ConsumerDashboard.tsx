import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatPKR } from '../../utils/tariff';
import { Badge } from '../common/Badge';
import { Bill } from '../../types';
import {
  Zap,
  CreditCard,
  AlertTriangle,
  History,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';

interface ConsumerDashboardProps {
  onOpenBillModal: (bill: Bill) => void;
  onOpenPayModal: (bill: Bill) => void;
}

export const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({
  onOpenBillModal,
  onOpenPayModal,
}) => {
  const { currentUser, bills, payments, complaints, setActiveTab } = useApp();

  if (!currentUser) return null;

  // Filter consumer bills
  const userBills = bills
    .filter(b => b.consumerId === currentUser.id)
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

  const latestBill = userBills[0];

  // Filter consumer payments
  const userPayments = payments
    .filter(p => p.consumerId === currentUser.id)
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

  const lastPayment = userPayments[0];

  // Consumer complaints
  const userComplaints = complaints
    .filter(c => c.consumerId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const activeComplaints = userComplaints.filter(
    c => c.status !== 'Resolved' && c.status !== 'Closed' && c.status !== 'Rejected'
  );

  // Six-month consumption trend for mini chart
  const historicalBills = [...userBills].reverse().slice(-6);

  return (
    <div className="space-y-7 animate-fade-in-up">
      {/* Welcome Banner with subtle navy-to-electric-blue gradient & decorative electric circuit */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0C1E36] via-[#142D4E] to-[#1A4278] text-white p-6 sm:p-8 shadow-[0_12px_36px_rgba(20,45,78,0.16)] relative overflow-hidden border border-white/10">
        {/* Subtle decorative electricity lines & glowing elements */}
        <div className="pointer-events-none absolute -right-12 -top-12 w-64 h-64 bg-[#2878F0]/25 rounded-full blur-3xl animate-electric-pulse" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 w-64 h-64 bg-[#48C6E8]/18 rounded-full blur-3xl animate-electric-pulse" />
        
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
          <circle cx="360" cy="180" r="2.5" fill="#2878F0" opacity="0.8" />
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-[#FFC857] border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#48C6E8] animate-pulse" />
              <span>PowerLink Smart Grid Connection • Active</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Welcome back, {currentUser.name}
            </h1>
            
            <p className="text-slate-300 text-xs sm:text-sm font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Consumer #{currentUser.consumerNumber}</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono">Meter #{currentUser.meterNumber}</span>
              <span className="text-slate-400">·</span>
              <span>{currentUser.city || 'Islamabad'} Sub-Division</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('bills')}
              className="px-5 py-2.5 bg-[#FFC857] hover:bg-[#ffbe38] active:scale-[0.98] text-[#142D4E] font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#FFC857]/20 hover:shadow-lg hover:shadow-[#FFC857]/30 flex items-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-[#142D4E]" />
              <span>Pay Bill</span>
            </button>
            <button
              onClick={() => setActiveTab('file-complaint')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white font-semibold rounded-xl text-xs sm:text-sm backdrop-blur-md transition-all duration-200 border border-white/20 hover:border-white/35 flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-[#FFC857]" />
              <span>New Complaint</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards with Staggered Entrance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Current Bill */}
        <div className="card-premium flex flex-col justify-between p-6 animate-fade-in-up delay-75">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8491A5]">
                Current Bill ({latestBill?.billingMonth || 'Active'})
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#2878F0]/10 text-[#2878F0] flex items-center justify-center border border-[#2878F0]/20 shadow-xs">
                <FileTextIcon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="text-3xl font-extrabold text-[#142D4E] mt-3 font-mono tracking-tight">
              {latestBill ? formatPKR(latestBill.totalCurrentBill) : 'Rs. 0'}
            </div>
            
            <div className="mt-3 flex items-center gap-2">
              {latestBill ? (
                <>
                  <Badge status={latestBill.status} size="sm" />
                  <span className="text-xs text-[#8491A5]">
                    Due: {latestBill.dueDate}
                  </span>
                </>
              ) : (
                <span className="text-xs text-[#8491A5]">No active bill</span>
              )}
            </div>
          </div>

          {latestBill && (
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onOpenBillModal(latestBill)}
                className="text-xs font-bold text-[#2878F0] hover:text-[#1f64d0] flex items-center gap-1 cursor-pointer transition-colors"
              >
                View Bill <ExternalLink className="w-3.5 h-3.5" />
              </button>
              {latestBill.status !== 'Paid' && (
                <button
                  onClick={() => onOpenPayModal(latestBill)}
                  className="text-xs font-bold text-[#FFC857] hover:text-[#e5b142] cursor-pointer transition-colors"
                >
                  Pay Now →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Card 2: Last Payment */}
        <div className="card-premium flex flex-col justify-between p-6 animate-fade-in-up delay-150">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8491A5]">
                Last Payment
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            
            <div className="text-3xl font-extrabold text-[#142D4E] mt-3 font-mono tracking-tight">
              {lastPayment ? formatPKR(lastPayment.amount) : 'Rs. 0'}
            </div>
            
            <div className="mt-3 text-xs text-[#8491A5] font-medium">
              {lastPayment ? (
                <div className="space-y-0.5">
                  <div className="font-semibold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Paid via {lastPayment.paymentMethod}
                  </div>
                  <div className="text-[11px] text-[#8491A5] font-mono pl-3">{lastPayment.paymentDate}</div>
                </div>
              ) : (
                <span className="text-[#8491A5]">No payments recorded</span>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('bills')}
              className="text-xs font-bold text-[#2878F0] hover:text-[#1f64d0] flex items-center gap-1 cursor-pointer transition-colors"
            >
              History <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Active Complaints */}
        <div className="card-premium flex flex-col justify-between p-6 animate-fade-in-up delay-225">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8491A5]">
                Active Complaints
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            
            <div className="text-3xl font-extrabold text-[#142D4E] mt-3 font-mono tracking-tight">
              {activeComplaints.length}
            </div>
            
            <div className="mt-3 text-xs text-[#8491A5]">
              {activeComplaints.length > 0 ? (
                <span className="text-amber-700 font-medium truncate block">
                  {activeComplaints[0].category} ({activeComplaints[0].status})
                </span>
              ) : (
                <span className="text-emerald-600 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  No open complaints
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('track-complaints')}
              className="text-xs font-bold text-[#2878F0] hover:text-[#1f64d0] flex items-center gap-1 cursor-pointer transition-colors"
            >
              Track Status <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 4: Grid Helpline */}
        <div className="card-premium flex flex-col justify-between p-6 animate-fade-in-up delay-300">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8491A5]">
                Grid Helpline
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#FFC857]/20 text-[#142D4E] flex items-center justify-center border border-[#FFC857]/30 shadow-xs">
                <PhoneCall className="w-5 h-5 text-[#142D4E]" />
              </div>
            </div>
            
            <div className="text-3xl font-extrabold text-[#142D4E] mt-3 font-mono tracking-tight">
              118
            </div>
            
            <div className="mt-3 text-xs text-[#8491A5]">
              24/7 Breakdown & Emergencies
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('help')}
              className="text-xs font-bold text-[#2878F0] hover:text-[#1f64d0] flex items-center gap-1 cursor-pointer transition-colors"
            >
              Support Info <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(20,45,78,0.03)] space-y-3">
        <h3 className="text-sm font-bold text-[#142D4E]">Quick Actions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => setActiveTab('bills')}
            className="w-full p-3.5 rounded-xl border border-slate-200/80 hover:border-[#2878F0]/40 hover:bg-[#F6F8FC] flex items-center justify-between text-left transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-[#2878F0] group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-[#172B45]">Pay Outstanding Bill</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#8491A5] group-hover:text-[#2878F0] transition-colors" />
          </button>

          <button
            onClick={() => setActiveTab('file-complaint')}
            className="w-full p-3.5 rounded-xl border border-slate-200/80 hover:border-[#FFC857]/50 hover:bg-[#F6F8FC] flex items-center justify-between text-left transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-[#172B45]">Report Fault or Outage</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#8491A5] group-hover:text-amber-500 transition-colors" />
          </button>

          <button
            onClick={() => setActiveTab('bills')}
            className="w-full p-3.5 rounded-xl border border-slate-200/80 hover:border-[#2878F0]/40 hover:bg-[#F6F8FC] flex items-center justify-between text-left transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-[#2878F0] group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-[#172B45]">Billing History</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#8491A5] group-hover:text-[#2878F0] transition-colors" />
          </button>
        </div>
      </div>

      {/* Recent Bills & Recent Complaints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bills Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(20,45,78,0.03)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#142D4E]">Recent Bills</h3>
            </div>
            <button
              onClick={() => setActiveTab('bills')}
              className="text-xs font-bold text-[#2878F0] hover:text-[#1f64d0] cursor-pointer transition-colors"
            >
              View All →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {userBills.slice(0, 3).map(bill => (
              <div key={bill.id} className="p-4 flex items-center justify-between hover:bg-[#F6F8FC] transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#142D4E]">{bill.billingMonth}</span>
                    <Badge status={bill.status} size="sm" />
                  </div>
                  <div className="text-[11px] text-[#8491A5] font-mono">
                    Bill #{bill.billNumber} • {bill.unitsConsumed} Units
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="text-sm font-black text-[#142D4E] font-mono">
                    {formatPKR(bill.totalCurrentBill)}
                  </div>
                  <button
                    onClick={() => onOpenBillModal(bill)}
                    className="text-xs font-semibold text-[#2878F0] hover:text-[#1f64d0] cursor-pointer transition-colors"
                  >
                    View Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(20,45,78,0.03)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#142D4E]">Recent Complaints</h3>
            </div>
            <button
              onClick={() => setActiveTab('track-complaints')}
              className="text-xs font-bold text-[#2878F0] hover:text-[#1f64d0] cursor-pointer transition-colors"
            >
              Track All →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {userComplaints.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8491A5]">
                No complaints submitted yet. Everything operating smoothly!
              </div>
            ) : (
              userComplaints.slice(0, 3).map(complaint => (
                <div key={complaint.id} className="p-4 flex items-start justify-between gap-3 hover:bg-[#F6F8FC] transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#142D4E]">{complaint.id}</span>
                      <Badge status={complaint.status} size="sm" />
                      <Badge priority={complaint.priority} size="sm" />
                    </div>
                    <div className="text-xs font-bold text-[#172B45] line-clamp-1">
                      {complaint.subject}
                    </div>
                    <div className="text-[11px] text-[#8491A5] font-mono">
                      Filed: {complaint.createdAt}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('track-complaints')}
                    className="text-xs font-semibold text-[#2878F0] hover:text-[#1f64d0] shrink-0 pt-1 cursor-pointer transition-colors"
                  >
                    Timeline →
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
