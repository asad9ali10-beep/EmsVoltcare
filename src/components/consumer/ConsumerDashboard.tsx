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
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 shadow-md shadow-blue-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-blue-200 text-xs font-medium">
              Consumer #{currentUser.consumerNumber} • Meter #{currentUser.meterNumber}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('pay')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Bill</span>
            </button>
            <button
              onClick={() => setActiveTab('file-complaint')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs backdrop-blur-xs transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>New Complaint</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Bill */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Current Bill ({latestBill?.billingMonth || 'Active'})
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                <FileTextIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {latestBill ? formatPKR(latestBill.totalCurrentBill) : 'Rs. 0'}
            </div>
            <div className="mt-2 flex items-center gap-2">
              {latestBill ? (
                <>
                  <Badge status={latestBill.status} size="sm" />
                  <span className="text-xs text-slate-500">
                    Due: {latestBill.dueDate}
                  </span>
                </>
              ) : (
                <span className="text-xs text-slate-400">No active bill</span>
              )}
            </div>
          </div>

          {latestBill && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onOpenBillModal(latestBill)}
                className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer"
              >
                View Bill <ExternalLink className="w-3 h-3" />
              </button>
              {latestBill.status !== 'Paid' && (
                <button
                  onClick={() => onOpenPayModal(latestBill)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                >
                  Pay Now →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Card 2: Last Payment */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Last Payment
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {lastPayment ? formatPKR(lastPayment.amount) : 'Rs. 0'}
            </div>
            <div className="mt-2 text-xs text-slate-600 font-medium">
              {lastPayment ? (
                <div className="space-y-0.5">
                  <div className="font-semibold text-emerald-700">
                    Paid via {lastPayment.paymentMethod}
                  </div>
                  <div className="text-[11px] text-slate-400">{lastPayment.paymentDate}</div>
                </div>
              ) : (
                <span className="text-slate-400">No payments recorded</span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('payments')}
              className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer"
            >
              History <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Active Complaints */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Complaints
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {activeComplaints.length}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {activeComplaints.length > 0 ? (
                <span className="text-amber-700 font-medium truncate block">
                  {activeComplaints[0].category} ({activeComplaints[0].status})
                </span>
              ) : (
                <span className="text-emerald-700 font-medium">No open complaints</span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('track-complaints')}
              className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer"
            >
              Track Status <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Grid Helpline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Helpline
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-black">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-red-600 mt-2 font-mono">
              118
            </div>
            <div className="mt-2 text-xs text-slate-500">
              24/7 Breakdown & Emergencies
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('help')}
              className="text-xs font-bold text-slate-700 hover:text-slate-950 flex items-center gap-1 cursor-pointer"
            >
              Support Info <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => setActiveTab('bills')}
            className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">Pay Outstanding Bill</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('file-complaint')}
            className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-900">Report Fault or Outage</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('bills')}
            className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold text-slate-900">Billing History</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Recent Bills & Recent Complaints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bills Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Bills</h3>
            </div>
            <button
              onClick={() => setActiveTab('bills')}
              className="text-xs font-bold text-blue-800 hover:text-blue-950 cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {userBills.slice(0, 3).map(bill => (
              <div key={bill.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{bill.billingMonth}</span>
                    <Badge status={bill.status} size="sm" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Bill #{bill.billNumber} • {bill.unitsConsumed} Units
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="text-sm font-black text-blue-900 font-mono">
                    {formatPKR(bill.totalCurrentBill)}
                  </div>
                  <button
                    onClick={() => onOpenBillModal(bill)}
                    className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                  >
                    View Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Complaints</h3>
            </div>
            <button
              onClick={() => setActiveTab('track-complaints')}
              className="text-xs font-bold text-blue-800 hover:text-blue-950 cursor-pointer"
            >
              Track All →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {userComplaints.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No complaints submitted yet. Everything operating smoothly!
              </div>
            ) : (
              userComplaints.slice(0, 3).map(complaint => (
                <div key={complaint.id} className="p-4 flex items-start justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-900">{complaint.id}</span>
                      <Badge status={complaint.status} size="sm" />
                      <Badge priority={complaint.priority} size="sm" />
                    </div>
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">
                      {complaint.subject}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Filed: {complaint.createdAt}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('track-complaints')}
                    className="text-xs font-semibold text-blue-700 hover:underline shrink-0 pt-1 cursor-pointer"
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
