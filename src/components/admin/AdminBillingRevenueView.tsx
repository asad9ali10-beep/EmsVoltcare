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
    <div className="space-y-6 max-w-7xl animate-fade-in-up">
      {/* Sub-Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#142D4E]">Billing & Revenue Management</h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/80 text-xs shadow-xs">
          <button
            onClick={() => setActiveSubTab('generate')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'generate' ? 'bg-[#2878F0] text-white shadow-xs' : 'text-[#8491A5] hover:text-[#172B45] hover:bg-[#F6F8FC]'
            }`}
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Generate Bills</span>
          </button>
          <button
            onClick={() => setActiveSubTab('revenue')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'revenue' ? 'bg-[#2878F0] text-white shadow-xs' : 'text-[#8491A5] hover:text-[#172B45] hover:bg-[#F6F8FC]'
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
