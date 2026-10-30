import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bill, Payment } from '../../types';
import { formatPKR } from '../../utils/tariff';
import { Badge } from '../common/Badge';
import {
  FileText,
  CreditCard,
  History,
  Search,
  CheckCircle2,
  Smartphone,
  Building2,
  Printer,
  ExternalLink,
} from 'lucide-react';

interface ConsumerBillsProps {
  onOpenBillModal: (bill: Bill) => void;
  onOpenPayModal: (bill: Bill) => void;
  onPaymentSuccess: (receipt: Payment) => void;
}

export const ConsumerBills: React.FC<ConsumerBillsProps> = ({
  onOpenBillModal,
  onOpenPayModal,
  onPaymentSuccess,
}) => {
  const { currentUser, bills, payments, payBill, showConfirmDialog, addToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'pay' | 'history'>('invoices');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment form state
  const unpaidBills = bills.filter(b => b.consumerId === currentUser?.id && b.status !== 'Paid');
  const [selectedBillId, setSelectedBillId] = useState<string>(
    unpaidBills.length > 0 ? unpaidBills[0].id : ''
  );
  const [method, setMethod] = useState<Payment['paymentMethod']>('JazzCash');
  const [phoneOrAccount, setPhoneOrAccount] = useState('03005544332');
  const [pinOrOtp, setPinOrOtp] = useState('1234');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [bankName, setBankName] = useState('Habib Bank Limited (HBL)');
  const [bankAccount, setBankAccount] = useState('PK76HABB00012345678');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!currentUser) return null;

  const userBills = bills.filter(b => b.consumerId === currentUser.id);
  const filteredBills = userBills
    .filter(b => {
      if (statusFilter !== 'All' && b.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return b.billingMonth.toLowerCase().includes(q) || b.billNumber.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

  const userPayments = payments
    .filter(p => p.consumerId === currentUser.id)
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

  const selectedBill = bills.find(b => b.id === selectedBillId);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill) {
      addToast('Please select a bill to pay.', 'error');
      return;
    }
    showConfirmDialog({
      title: `Confirm Payment of ${formatPKR(selectedBill.totalCurrentBill)}`,
      message: `Authorize payment for bill #${selectedBill.billNumber} (${selectedBill.billingMonth}) via ${method}?`,
      confirmLabel: 'Authorize Payment',
      onConfirm: () => {
        setIsProcessing(true);
        setTimeout(() => {
          let ref = phoneOrAccount;
          if (method === 'Debit/Credit Card') ref = `Card ending in ${cardNumber.slice(-4)}`;
          else if (method === 'Bank Transfer') ref = `${bankName}`;

          const receipt = payBill(selectedBill.id, method, ref);
          setIsProcessing(false);
          if (receipt) {
            onPaymentSuccess(receipt);
            setActiveSubTab('history');
          }
        }, 500);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Bills & Payments</h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('invoices')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'invoices' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Invoices ({userBills.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('pay')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'pay' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pay Bill ({unpaidBills.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'history' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({userPayments.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INVOICES */}
      {activeSubTab === 'invoices' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search billing month or bill #..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              {['All', 'Unpaid', 'Paid', 'Overdue'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    statusFilter === status ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Billing Month</th>
                    <th className="py-3.5 px-4">Bill Number</th>
                    <th className="py-3.5 px-4">Readings</th>
                    <th className="py-3.5 px-4 text-center">Units</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-4 text-right">Amount (PKR)</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredBills.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No bills found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBills.map(bill => (
                      <tr key={bill.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">{bill.billingMonth}</td>
                        <td className="py-3.5 px-4 font-mono text-blue-900 font-semibold whitespace-nowrap">{bill.billNumber}</td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono whitespace-nowrap">
                          {bill.previousReading} → {bill.currentReading}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-800">{bill.unitsConsumed}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">{bill.dueDate}</td>
                        <td className="py-3.5 px-4 text-right font-black text-slate-900 font-mono text-sm whitespace-nowrap">
                          {formatPKR(bill.totalCurrentBill)}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <Badge status={bill.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onOpenBillModal(bill)}
                              className="px-2.5 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                            {bill.status !== 'Paid' && (
                              <button
                                onClick={() => {
                                  setSelectedBillId(bill.id);
                                  setActiveSubTab('pay');
                                }}
                                className="px-2.5 py-1.5 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Pay</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAY ONLINE */}
      {activeSubTab === 'pay' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-blue-900">
              Select Unpaid Bill
            </h3>
            {unpaidBills.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                <p className="text-xs font-semibold">All bills are currently paid!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {unpaidBills.map(b => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBillId(b.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedBillId === b.id
                        ? 'border-blue-800 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{b.billingMonth}</span>
                      <span className="font-mono font-black text-blue-900 text-sm">{formatPKR(b.totalCurrentBill)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>Due: {b.dueDate}</span>
                      <span className="font-mono">{b.billNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            {unpaidBills.length === 0 || !selectedBill ? (
              <div className="p-12 text-center text-slate-400">
                <p className="text-xs">No bill selected or all bills paid.</p>
              </div>
            ) : (
              <form onSubmit={handlePaySubmit} className="space-y-5 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Selected Statement:</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedBill.billingMonth} (#{selectedBill.billNumber})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[11px]">Amount Payable:</span>
                    <span className="font-mono font-black text-blue-900 text-base">{formatPKR(selectedBill.totalCurrentBill)}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Select Payment Gateway</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(['JazzCash', 'Easypaisa', 'Debit/Credit Card', 'Bank Transfer'] as const).map(m => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setMethod(m)}
                        className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                          method === m ? 'border-blue-800 bg-blue-800 text-white shadow-xs' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {(method === 'JazzCash' || method === 'Easypaisa') && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Account Number *</label>
                      <input
                        type="text"
                        value={phoneOrAccount}
                        onChange={e => setPhoneOrAccount(e.target.value)}
                        placeholder="03001234567"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">4-Digit MPIN *</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={pinOrOtp}
                        onChange={e => setPinOrOtp(e.target.value)}
                        placeholder="1234"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                )}

                {method === 'Debit/Credit Card' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Card Number *</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Expiry *</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">CVC *</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          placeholder="123"
                          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {method === 'Bank Transfer' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Select Bank *</label>
                      <select
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium"
                      >
                        <option>Habib Bank Limited (HBL)</option>
                        <option>Meezan Bank</option>
                        <option>National Bank of Pakistan (NBP)</option>
                        <option>Allied Bank (ABL)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">IBAN / Account # *</label>
                      <input
                        type="text"
                        value={bankAccount}
                        onChange={e => setBankAccount(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{isProcessing ? 'Processing Payment...' : `Pay ${formatPKR(selectedBill.totalCurrentBill)}`}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT HISTORY */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Transaction ID</th>
                  <th className="py-3.5 px-4">Bill Number</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {userPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No payment history found.
                    </td>
                  </tr>
                ) : (
                  userPayments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">{p.transactionId}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">{p.billNumber}</td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{p.paymentDate}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">{p.paymentMethod}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">{p.accountReference}</td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900 font-mono text-sm whitespace-nowrap">
                        {formatPKR(p.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Successful
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
