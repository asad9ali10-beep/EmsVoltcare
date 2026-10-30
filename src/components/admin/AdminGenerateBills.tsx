import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateBillCharges, formatPKR } from '../../utils/tariff';
import { Bill } from '../../types';
import {
  FilePlus,
  Zap,
  Calculator,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Eye,
} from 'lucide-react';

interface AdminGenerateBillsProps {
  onOpenBillModal: (bill: Bill) => void;
}

export const AdminGenerateBills: React.FC<AdminGenerateBillsProps> = ({ onOpenBillModal }) => {
  const { users, bills, generateBill, generateBillsForAll, showConfirmDialog, addToast } = useApp();

  const consumers = users.filter(u => u.role === 'consumer' && u.active);

  const [selectedConsumerId, setSelectedConsumerId] = useState<string>(
    consumers.length > 0 ? consumers[0].id : ''
  );
  const [billingMonth, setBillingMonth] = useState('November 2026');

  // Find previous reading for selected consumer
  const selectedConsumer = consumers.find(c => c.id === selectedConsumerId);
  const consumerBills = bills
    .filter(b => b.consumerId === selectedConsumerId)
    .sort((a, b) => b.currentReading - a.currentReading);
  const previousReading = consumerBills.length > 0 ? consumerBills[0].currentReading : 1200;

  const [currentReading, setCurrentReading] = useState<number>(previousReading + 280);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

  // Auto update current reading when consumer selection changes
  React.useEffect(() => {
    if (consumerBills.length > 0) {
      const prev = consumerBills[0].currentReading;
      setCurrentReading(prev + 240);
    }
  }, [selectedConsumerId]);

  // Live calculation preview
  const liveCalculation = calculateBillCharges(previousReading, currentReading);

  const handleGenerateSingle = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedConsumerId) {
      addToast('Please select a consumer.', 'error');
      return;
    }

    if (currentReading < previousReading) {
      addToast(`Current reading cannot be less than previous reading (${previousReading}).`, 'error');
      return;
    }

    const bill = generateBill(selectedConsumerId, currentReading, billingMonth);
    if (bill) {
      // update preview for next reading
      setCurrentReading(currentReading + 250);
    }
  };

  const handleBatchGenerate = () => {
    showConfirmDialog({
      title: `Generate Bills for All ${consumers.length} Active Consumers?`,
      message: `This will simulate meter readings for all registered active consumers for ${billingMonth} and compute slab-based bills automatically.`,
      confirmLabel: 'Run Batch Generation',
      isDanger: false,
      onConfirm: () => {
        setIsGeneratingBatch(true);
        setTimeout(() => {
          generateBillsForAll();
          setIsGeneratingBatch(false);
        }, 600);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Billing Generator</h2>
          <p className="text-xs text-slate-500">
            Slab-based tariff computation & issuance
          </p>
        </div>

        {/* Batch Generate Button */}
        <button
          onClick={handleBatchGenerate}
          disabled={isGeneratingBatch}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-amber-400/20 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>{isGeneratingBatch ? 'Generating Batch...' : 'Generate Batch (All Consumers)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Consumer & Reading Inputs */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-900 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Billing Inputs
          </h3>

          <form onSubmit={handleGenerateSingle} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Select Consumer *
              </label>
              <select
                value={selectedConsumerId}
                onChange={e => setSelectedConsumerId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                {consumers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.consumerNumber} - Meter: {c.meterNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Billing Cycle Month *
              </label>
              <select
                value={billingMonth}
                onChange={e => setBillingMonth(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                <option>November 2026</option>
                <option>December 2026</option>
                <option>January 2027</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block">Previous Meter Reading:</span>
              <span className="text-base font-mono font-bold text-slate-800">
                {previousReading.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block">From last billing cycle</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Meter Reading *
              </label>
              <input
                type="number"
                required
                min={previousReading}
                value={currentReading}
                onChange={e => setCurrentReading(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono font-bold"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Calculated Units: <strong className="text-blue-900">{Math.max(0, currentReading - previousReading)} kWh</strong>
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <FilePlus className="w-4 h-4" />
                <span>Issue & Generate Bill</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Form: Live Calculation Preview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-900 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Live NEPRA Slab Calculation Breakdown
              </h3>
              <p className="text-xs text-slate-500">Instant preview before saving to ledger</p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-blue-50 text-blue-900 rounded-md">
              {liveCalculation.unitsConsumed} Units
            </span>
          </div>

          {/* Slab Breakdown Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Consumption Slab</th>
                  <th className="p-2.5 text-center">Units in Slab</th>
                  <th className="p-2.5 text-center">NEPRA Rate</th>
                  <th className="p-2.5 text-right">Cost (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {liveCalculation.slabBreakdown.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-semibold text-slate-800">{s.slab}</td>
                    <td className="p-2.5 text-center font-mono">{s.units}</td>
                    <td className="p-2.5 text-center font-mono text-slate-600">Rs. {s.rate.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      {formatPKR(s.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cost Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                Taxes & Surcharges
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Energy Charges:</span>
                <span className="font-mono font-bold">{formatPKR(liveCalculation.energyCharges)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Fuel Adjustment (FPA):</span>
                <span className="font-mono">{formatPKR(liveCalculation.fuelPriceAdjustment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Electricity Duty (1.5%):</span>
                <span className="font-mono">{formatPKR(liveCalculation.electricityDuty)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">GST (17%):</span>
                <span className="font-mono">{formatPKR(liveCalculation.gst)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">PTV License Fee:</span>
                <span className="font-mono">{formatPKR(liveCalculation.tvFee)}</span>
              </div>
            </div>

            <div className="p-5 rounded-xl border-2 border-blue-900 bg-blue-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-blue-900 block mb-1">
                  Payable Within Due Date
                </span>
                <div className="text-3xl font-black text-blue-950 font-mono">
                  {formatPKR(liveCalculation.totalCurrentBill)}
                </div>
              </div>

              <div className="pt-3 border-t border-blue-200 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Late Fee Surcharge (5%):</span>
                  <span className="font-mono text-red-600 font-bold">+{formatPKR(liveCalculation.lateFeeSurcharge)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-1">
                  <span>After Due Date:</span>
                  <span className="font-mono text-red-700 text-sm">{formatPKR(liveCalculation.payableAfterDueDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
