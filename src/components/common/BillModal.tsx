import React from 'react';
import { Bill } from '../../types';
import { formatPKR } from '../../utils/tariff';
import { Printer, X, Zap, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Badge } from './Badge';

interface BillModalProps {
  bill: Bill | null;
  onClose: () => void;
  onPayNow?: (bill: Bill) => void;
}

export const BillModal: React.FC<BillModalProps> = ({ bill, onClose, onPayNow }) => {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142D4E]/60 backdrop-blur-xs overflow-y-auto animate-fade-in-up">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-[0_20px_60px_rgba(20,45,78,0.25)] border border-slate-200/80 overflow-hidden my-8 print-page">
        {/* Modal Top Actions (Hidden in print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F6F8FC] border-b border-slate-200/80 no-print">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-[#2878F0]/10 text-[#2878F0] px-2.5 py-1 rounded-lg">
              {bill.billNumber}
            </span>
            <Badge status={bill.status} size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#172B45] bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#8491A5]" />
              Print / Save PDF
            </button>
            {bill.status !== 'Paid' && onPayNow && (
              <button
                onClick={() => {
                  onClose();
                  onPayNow(bill);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2878F0] hover:bg-[#1f64d0] rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Pay This Bill
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#8491A5] hover:text-[#172B45] hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Bill Document Layout */}
        <div className="p-6 md:p-8 space-y-6 text-[#172B45] bg-white">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b-2 border-[#142D4E] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#142D4E] text-[#FFC857] flex items-center justify-center shadow-md">
                <Zap className="w-7 h-7 fill-[#FFC857]" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-[#142D4E] tracking-tight flex items-center gap-2">
                  PowerLink <span className="text-xs bg-[#FFC857] text-[#142D4E] font-extrabold px-2 py-0.5 rounded">UTILITY</span>
                </h1>
                <p className="text-xs text-[#8491A5] font-medium">Electricity Distribution & Supply Authority (WAPDA / NEPRA Registered)</p>
              </div>
            </div>

            <div className="text-left md:text-right">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Billing Month</div>
              <div className="text-lg font-black text-blue-900">{bill.billingMonth}</div>
              <div className="text-xs font-mono text-slate-600 mt-0.5">Ref No: {bill.billNumber}</div>
            </div>
          </div>

          {/* Consumer Info & Meter Metadata Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-blue-800 border-b border-slate-200 pb-1.5">
                Consumer Information
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Consumer Name:</span>
                <span className="font-bold text-slate-900">{bill.consumerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Consumer ID / Account:</span>
                <span className="font-mono font-bold text-blue-900">{bill.consumerNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Tariff Category:</span>
                <span className="font-semibold text-slate-800">A-1 Residential</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-blue-800 border-b border-slate-200 pb-1.5">
                Metering & Schedule
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Meter Serial No:</span>
                <span className="font-mono font-bold text-slate-900">{bill.meterNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Issue Date:</span>
                <span className="font-semibold text-slate-800">{bill.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Due Date (Normal):</span>
                <span className="font-bold text-red-600">{bill.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Meter Readings Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="bg-blue-800 text-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest">
              Meter Reading & Consumption
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Previous Reading</th>
                  <th className="p-3">Present Reading</th>
                  <th className="p-3">Multiplier</th>
                  <th className="p-3 text-right">Units Consumed (kWh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="p-3 font-medium text-slate-700">{bill.previousReading.toLocaleString()}</td>
                  <td className="p-3 font-bold text-slate-900">{bill.currentReading.toLocaleString()}</td>
                  <td className="p-3 text-slate-600">1.0</td>
                  <td className="p-3 text-right text-sm font-black text-blue-900">
                    {bill.unitsConsumed} Units
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Slab Breakdown */}
          {bill.slabBreakdown && bill.slabBreakdown.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="bg-slate-100 text-slate-800 px-4 py-2 text-[11px] font-bold uppercase tracking-widest border-b border-slate-200">
                Government Slab-wise Tariff Breakdown
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Consumption Slab</th>
                    <th className="p-2.5 text-center">Units in Slab</th>
                    <th className="p-2.5 text-center">NEPRA Rate / Unit</th>
                    <th className="p-2.5 text-right">Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bill.slabBreakdown.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-medium text-slate-800">{s.slab}</td>
                      <td className="p-2.5 text-center font-mono">{s.units}</td>
                      <td className="p-2.5 text-center font-mono text-slate-600">Rs. {s.rate.toFixed(2)}</td>
                      <td className="p-2.5 text-right font-mono font-semibold text-slate-900">
                        {formatPKR(s.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Financial Breakdown & Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Taxes & Charges List */}
            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-blue-900 border-b border-slate-200 pb-1.5">
                Charges, Surcharges & Taxes
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Cost of Electricity:</span>
                <span className="font-mono font-semibold">{formatPKR(bill.energyCharges)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Fuel Price Adjustment (FPA):</span>
                <span className="font-mono font-semibold">{formatPKR(bill.fuelPriceAdjustment)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Electricity Duty (1.5%):</span>
                <span className="font-mono font-semibold">{formatPKR(bill.electricityDuty)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">General Sales Tax (17% GST):</span>
                <span className="font-mono font-semibold">{formatPKR(bill.gst)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">PTV License Fee:</span>
                <span className="font-mono font-semibold">{formatPKR(bill.tvFee)}</span>
              </div>
            </div>

            {/* Total Payable Summary Box */}
            <div className="flex flex-col justify-between p-5 rounded-xl border-2 border-blue-900 bg-blue-50/40">
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-blue-900 mb-1">
                  Payable Within Due Date ({bill.dueDate})
                </div>
                <div className="text-3xl font-black text-blue-900 tracking-tight">
                  {formatPKR(bill.totalCurrentBill)}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Late Surcharge (5%):</span>
                  <span className="font-mono text-red-600 font-bold">+{formatPKR(bill.lateFeeSurcharge)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1">
                  <span>Payable After Due Date:</span>
                  <span className="font-mono text-red-700 text-sm">{formatPKR(bill.payableAfterDueDate)}</span>
                </div>
              </div>

              {/* Status Stamp */}
              <div className="mt-4 pt-3 border-t border-blue-200">
                {bill.status === 'Paid' ? (
                  <div className="flex items-center gap-2 p-2.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold">PAID ON {bill.paidDate}</div>
                      <div className="text-[11px] text-emerald-700 font-mono">
                        {bill.paymentMethod} • Txn: {bill.transactionId}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2.5 bg-amber-100 text-amber-900 rounded-lg text-xs font-semibold">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-bold">{bill.status === 'Overdue' ? 'BILL OVERDUE' : 'PAYMENT PENDING'}</div>
                      <div className="text-[11px] text-amber-800">
                        Payable via JazzCash, Easypaisa, 1Link or Bank
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Barcode Graphic Simulation & Disclaimer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="font-mono text-[9px] tracking-[3px] bg-slate-900 text-white px-3 py-1 rounded">
                |||| | ||| |||||| | |||||||| |||| |
              </div>
              <span className="font-mono text-[10px] text-slate-500">{bill.billNumber}</span>
            </div>
            <div className="text-center md:text-right text-[11px] text-[#8491A5]">
              24/7 Helpline: 118 • SMS: 8118 • complaints@powerlink.gov.pk
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
