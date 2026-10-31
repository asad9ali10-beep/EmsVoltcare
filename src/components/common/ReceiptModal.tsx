import React from 'react';
import { Payment } from '../../types';
import { formatPKR } from '../../utils/tariff';
import { CheckCircle2, Printer, X, Zap } from 'lucide-react';

interface ReceiptModalProps {
  payment: Payment | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, onClose }) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden print-page animate-in fade-in zoom-in-95 duration-150">
        {/* Top actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 no-print">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Official Payment Receipt
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-8 space-y-6 text-slate-800 bg-white">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-2xl font-black text-slate-900">Payment Successful</div>
            <p className="text-xs text-slate-500">Your electricity bill has been reconciled and marked as PAID.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Transaction ID:</span>
              <span className="font-mono font-bold text-blue-900">{payment.transactionId}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Bill Number:</span>
              <span className="font-mono font-semibold text-slate-800">{payment.billNumber}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Consumer Name:</span>
              <span className="font-semibold text-slate-900">{payment.consumerName}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Payment Channel:</span>
              <span className="font-semibold text-slate-900">{payment.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Account / Reference:</span>
              <span className="font-mono text-slate-700">{payment.accountReference}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Payment Timestamp:</span>
              <span className="font-medium text-slate-700">{payment.paymentDate}</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-sm">
              <span className="font-bold text-slate-900">Total Paid:</span>
              <span className="font-black text-blue-900 text-lg font-mono">{formatPKR(payment.amount)}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center flex items-center justify-center gap-2 text-xs text-blue-900">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>PowerLink Electric Supply Authority • System Reconciled</span>
          </div>

          <div className="no-print pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
