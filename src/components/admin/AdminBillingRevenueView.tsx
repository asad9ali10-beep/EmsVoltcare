import React, { useState } from 'react';
import { FilePlus, DollarSign } from 'lucide-react';
import { AdminGenerateBills } from './AdminGenerateBills';
import { AdminRevenue } from './AdminRevenue';
import { Bill, Payment } from '../../types';

interface AdminBillingRevenueViewProps {
  onOpenBillModal: (bill: Bill) => void;
  onViewReceipt: (payment: Payment) => void;
}

export const AdminBillingRevenueView: React.FC<AdminBillingRevenueViewProps> = ({
  onOpenBillModal,
  onViewReceipt,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'generate' | 'revenue'>('generate');

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Sub-Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Billing & Revenue Management</h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('generate')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'generate' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Generate Bills</span>
          </button>
          <button
            onClick={() => setActiveSubTab('revenue')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'revenue' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Payments & Revenue</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Content */}
      <div>
        {activeSubTab === 'generate' && <AdminGenerateBills onOpenBillModal={onOpenBillModal} />}
        {activeSubTab === 'revenue' && <AdminRevenue onViewReceipt={onViewReceipt} />}
      </div>
    </div>
  );
};
