import React, { useState } from 'react';
import { Bill, Payment } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatPKR } from '../../utils/tariff';
import { CreditCard, Smartphone, Building2, ShieldCheck, X, Check } from 'lucide-react';

interface PaymentModalProps {
  bill: Bill | null;
  onClose: () => void;
  onPaymentSuccess: (receipt: Payment) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ bill, onClose, onPaymentSuccess }) => {
  const { payBill, showConfirmDialog, addToast } = useApp();

  const [method, setMethod] = useState<Payment['paymentMethod']>('JazzCash');
  const [phoneOrAccount, setPhoneOrAccount] = useState('03005544332');
  const [pinOrOtp, setPinOrOtp] = useState('1234');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [bankName, setBankName] = useState('Habib Bank Limited (HBL)');
  const [bankAccount, setBankAccount] = useState('PK76HABB00012345678');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!bill) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (method === 'JazzCash' || method === 'Easypaisa') {
      if (!phoneOrAccount || phoneOrAccount.length < 10) {
        addToast('Please enter a valid 11-digit mobile wallet number (e.g. 03001234567)', 'error');
        return;
      }
      if (!pinOrOtp || pinOrOtp.length < 4) {
        addToast('Please enter your 4-digit MPIN or verification code.', 'error');
        return;
      }
    } else if (method === 'Debit/Credit Card') {
      if (!cardNumber || cardNumber.replace(/\s+/g, '').length < 16) {
        addToast('Please enter a valid 16-digit debit/credit card number.', 'error');
        return;
      }
      if (!cardExpiry || !cardExpiry.includes('/')) {
        addToast('Please enter card expiry in MM/YY format.', 'error');
        return;
      }
    } else if (method === 'Bank Transfer') {
      if (!bankAccount || bankAccount.length < 8) {
        addToast('Please enter account number or IBAN.', 'error');
        return;
      }
    }

    // Confirmation Popup
    showConfirmDialog({
      title: `Confirm Payment of ${formatPKR(bill.totalCurrentBill)}`,
      message: `Are you sure you want to charge ${formatPKR(bill.totalCurrentBill)} for Bill #${bill.billNumber} (${bill.billingMonth}) using ${method}?`,
      confirmLabel: 'Pay Now',
      isDanger: false,
      onConfirm: () => {
        setIsProcessing(true);
        setTimeout(() => {
          let ref = phoneOrAccount;
          if (method === 'Debit/Credit Card') {
            ref = `Card ending in ${cardNumber.slice(-4)}`;
          } else if (method === 'Bank Transfer') {
            ref = `${bankName} (${bankAccount.slice(0, 10)}...)`;
          }

          const receipt = payBill(bill.id, method, ref);
          setIsProcessing(false);
          if (receipt) {
            onClose();
            onPaymentSuccess(receipt);
          }
        }, 600);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142D4E]/60 backdrop-blur-xs overflow-y-auto animate-fade-in-up">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-[0_20px_60px_rgba(20,45,78,0.25)] border border-slate-200/80 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F6F8FC] border-b border-slate-200/80">
          <div>
            <h3 className="text-base font-bold text-[#142D4E]">Pay Electricity Bill</h3>
            <p className="text-xs text-[#8491A5]">Bill #{bill.billNumber} • {bill.billingMonth}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8491A5] hover:text-[#172B45] hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Amount Overview Card */}
          <div className="p-4 rounded-xl bg-[#2878F0]/5 border border-[#2878F0]/20 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-[#2878F0] uppercase tracking-wider">Payable Amount</div>
              <div className="text-2xl font-black text-[#142D4E] font-mono">{formatPKR(bill.totalCurrentBill)}</div>
            </div>
            <div className="text-right text-xs">
              <span className="text-[#8491A5]">Units Billed: </span>
              <span className="font-bold text-[#172B45]">{bill.unitsConsumed} kWh</span>
              <div className="text-rose-600 font-medium">Due: {bill.dueDate}</div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod('JazzCash')}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  method === 'JazzCash'
                    ? 'border-red-600 bg-red-50/50 ring-2 ring-red-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    JC
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">JazzCash</div>
                    <div className="text-[10px] text-slate-500">Mobile Wallet</div>
                  </div>
                </div>
                {method === 'JazzCash' && <Check className="w-4 h-4 text-red-600" />}
              </button>

              <button
                type="button"
                onClick={() => setMethod('Easypaisa')}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  method === 'Easypaisa'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    EP
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Easypaisa</div>
                    <div className="text-[10px] text-slate-500">Mobile Account</div>
                  </div>
                </div>
                {method === 'Easypaisa' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                type="button"
                onClick={() => setMethod('Debit/Credit Card')}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  method === 'Debit/Credit Card'
                    ? 'border-blue-800 bg-blue-50/50 ring-2 ring-blue-800/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-800 text-white flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Card</div>
                    <div className="text-[10px] text-slate-500">Visa / Master / PayPak</div>
                  </div>
                </div>
                {method === 'Debit/Credit Card' && <Check className="w-4 h-4 text-blue-800" />}
              </button>

              <button
                type="button"
                onClick={() => setMethod('Bank Transfer')}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  method === 'Bank Transfer'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Bank Transfer</div>
                    <div className="text-[10px] text-slate-500">1Link / Online IBFT</div>
                  </div>
                </div>
                {method === 'Bank Transfer' && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            </div>
          </div>

          {/* Conditional Method Inputs */}
          {(method === 'JazzCash' || method === 'Easypaisa') && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {method} Mobile Account Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={phoneOrAccount}
                    onChange={e => setPhoneOrAccount(e.target.value)}
                    placeholder="03001234567"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  4-Digit MPIN / Verification Code
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={pinOrOtp}
                  onChange={e => setPinOrOtp(e.target.value)}
                  placeholder="****"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono tracking-widest"
                />
                <p className="text-[11px] text-slate-500 mt-1">Demo PIN: 1234 (Simulated Payment)</p>
              </div>
            </div>
          )}

          {method === 'Debit/Credit Card' && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CVC / CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value)}
                    placeholder="123"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {method === 'Bank Transfer' && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Bank</label>
                <select
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>Habib Bank Limited (HBL)</option>
                  <option>Meezan Bank Limited</option>
                  <option>United Bank Limited (UBL)</option>
                  <option>National Bank of Pakistan (NBP)</option>
                  <option>Allied Bank (ABL)</option>
                  <option>Standard Chartered Pakistan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Account / IBAN
                </label>
                <input
                  type="text"
                  required
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value)}
                  placeholder="PK76HABB00012345678"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>
            </div>
          )}

          {/* Secure badge */}
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>256-Bit SSL Encrypted 1Link / State Bank of Pakistan Compliant Gateway</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-[#172B45] bg-[#F6F8FC] hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#2878F0] hover:bg-[#1f64d0] disabled:opacity-50 rounded-xl shadow-sm hover:shadow-md hover:shadow-[#2878F0]/25 transition-all cursor-pointer flex items-center gap-2"
            >
              {isProcessing ? 'Processing Transaction...' : `Confirm & Pay ${formatPKR(bill.totalCurrentBill)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
