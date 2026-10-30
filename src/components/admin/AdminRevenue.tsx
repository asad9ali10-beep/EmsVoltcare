import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPKR } from '../../utils/tariff';
import { Payment } from '../../types';
import {
  DollarSign,
  Search,
  Filter,
  Printer,
  Download,
  Calendar,
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface AdminRevenueProps {
  onViewReceipt: (payment: Payment) => void;
}

export const AdminRevenue: React.FC<AdminRevenueProps> = ({ onViewReceipt }) => {
  const { payments } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('All');

  const filteredPayments = payments.filter(p => {
    if (methodFilter !== 'All' && p.paymentMethod !== methodFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.transactionId.toLowerCase().includes(q) ||
        p.consumerName.toLowerCase().includes(q) ||
        p.billNumber.toLowerCase().includes(q) ||
        p.accountReference.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCollected = filteredPayments.reduce((acc, p) => acc + p.amount, 0);

  // Method breakdowns
  const jazzCashTotal = payments
    .filter(p => p.paymentMethod === 'JazzCash')
    .reduce((acc, p) => acc + p.amount, 0);
  const easyPaisaTotal = payments
    .filter(p => p.paymentMethod === 'Easypaisa')
    .reduce((acc, p) => acc + p.amount, 0);
  const cardTotal = payments
    .filter(p => p.paymentMethod === 'Debit/Credit Card')
    .reduce((acc, p) => acc + p.amount, 0);
  const bankTotal = payments
    .filter(p => p.paymentMethod === 'Bank Transfer')
    .reduce((acc, p) => acc + p.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Revenue & Collections</h2>
          <p className="text-xs text-slate-500">
            Payment transactions and channel settlements
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Ledger</span>
        </button>
      </div>

      {/* Revenue Channel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-blue-900 text-white p-4 rounded-2xl shadow-md sm:col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block">Total Revenue</span>
          <div className="text-2xl font-black font-mono mt-1 text-amber-300">
            {formatPKR(totalCollected)}
          </div>
          <span className="text-[10px] text-blue-200 mt-1 block font-medium">
            {filteredPayments.length} transactions reconciled
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">JazzCash</span>
          <div className="text-lg font-black text-slate-900 font-mono mt-1">
            {formatPKR(jazzCashTotal)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Mobile Wallets</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Easypaisa</span>
          <div className="text-lg font-black text-slate-900 font-mono mt-1">
            {formatPKR(easyPaisaTotal)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Telenor Microbank</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Debit / Cards</span>
          <div className="text-lg font-black text-slate-900 font-mono mt-1">
            {formatPKR(cardTotal)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Visa / Master / PayPak</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">1Link IBFT</span>
          <div className="text-lg font-black text-slate-900 font-mono mt-1">
            {formatPKR(bankTotal)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Direct Bank Transfer</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Txn ID, consumer name, bill #..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          {['All', 'JazzCash', 'Easypaisa', 'Debit/Credit Card', 'Bank Transfer'].map(method => (
            <button
              key={method}
              onClick={() => setMethodFilter(method)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                methodFilter === method
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print-page">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Bill Ref</th>
                <th className="py-3.5 px-4">Consumer Name</th>
                <th className="py-3.5 px-4">Payment Channel</th>
                <th className="py-3.5 px-4">Account Reference</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Amount (PKR)</th>
                <th className="py-3.5 px-4 text-right no-print">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No transactions match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {p.transactionId}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {p.billNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {p.consumerName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {p.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {p.accountReference}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {p.paymentDate}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 font-mono text-sm whitespace-nowrap">
                      {formatPKR(p.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap no-print">
                      <button
                        onClick={() => onViewReceipt(p)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
