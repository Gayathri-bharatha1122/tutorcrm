import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  DollarSign, 
  Calendar, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  X, 
  CreditCard, 
  Bell, 
  ArrowRight,
  GraduationCap,
  Sparkles,
  Award
} from 'lucide-react';
import { Bill, Announcement } from '../types';

interface ParentDashboardProps {
  bills: Bill[];
  announcements: Announcement[];
  parentName: string;
  studentName: string;
  onUpdateBills: (updatedBills: Bill[]) => void;
  onLogout: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  bills,
  announcements,
  parentName,
  studentName,
  onUpdateBills,
  onLogout
}) => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);
  
  // Card details mock states
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4921');
  const [cardHolder, setCardHolder] = useState('HELENA THORNE');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvv, setCardCvv] = useState('642');

  const handlePayClick = (bill: Bill) => {
    setSelectedBill(bill);
    setPaymentSuccessMessage(null);
  };

  const handleConfirmMockPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill) return;

    setIsProcessingPayment(true);

    // Simulate merchant bank network delays
    setTimeout(() => {
      // Find and match billing item, flip status to Paid
      const nextBills = bills.map((b) => {
        if (b.id === selectedBill.id) {
          return { ...b, status: 'Paid' as const, paidDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) };
        }
        return b;
      });

      onUpdateBills(nextBills);
      setIsProcessingPayment(false);
      setSelectedBill(null);
      
      setPaymentSuccessMessage(`Payment for "${selectedBill.itemName}" processed successfully. Invoiced balance cleared.`);
      setTimeout(() => setPaymentSuccessMessage(null), 4000);
    }, 2000);
  };

  // Compute Outstanding Dues Surcharge
  const totalOutstanding = bills
    .filter((b) => b.status === 'Pending' || b.status === 'Overdue')
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Upper Navigation bars */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-sans font-bold text-base text-white tracking-tight">EduManage Parent</span>
              <span className="text-[10px] block text-slate-500 font-semibold uppercase">Guardian Link Account</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-200 block">{parentName}</span>
                <span className="text-[10px] text-amber-400 font-bold uppercase font-mono">Linked Child • {studentName}</span>
              </div>
              <button 
                onClick={onLogout}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-semibold rounded-lg transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* Payments Status Notification alerts */}
        <AnimatePresence>
          {paymentSuccessMessage && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="bg-emerald-600 border border-emerald-500/30 rounded-2xl p-4 text-white text-xs font-bold flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-200" />
                <span>{paymentSuccessMessage}</span>
              </div>
              <button onClick={() => setPaymentSuccessMessage(null)}>
                <X className="h-4 w-4 text-emerald-200 hover:text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Highlight Child Metrics Header with tracking gauges */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-850 pb-6 mb-6 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block bg-amber-500/10 w-max px-2.5 py-0.5 rounded-md">
                Active Student Linkage
              </span>
              <h2 className="text-xl font-bold text-white">Student Progress Directory: {studentName}</h2>
              <p className="text-slate-400 text-xs">Educational metrics synchronized directly with Prof. Alistair Miller's study journals.</p>
            </div>

            {/* Total Balance block */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex items-center justify-between gap-6 min-w-xs shrink-0">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Outstanding Balance Due</span>
                <span className="text-2xl font-extrabold text-white block">${totalOutstanding}</span>
              </div>
              {totalOutstanding > 0 ? (
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-[10px] font-bold border border-amber-500/20 flex items-center gap-1 animate-pulse">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Action Required
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/20">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" /> Zero Dues
                </span>
              )}
            </div>
          </div>

          {/* Progress Indicators and circular tracker panels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Metric 1 */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Attendance Rate</span>
                <span className="text-lg font-bold text-white block mt-0.5">98.2%</span>
                <span className="text-[10px] text-emerald-400 font-bold block">Excellent • Standard Class 11B</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Homework Completion</span>
                <span className="text-lg font-bold text-white block mt-0.5">94.1%</span>
                <span className="text-[10px] text-teal-400 font-bold block">Highly Consistent • +3% vs. Avg</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Average Course Grades</span>
                <span className="text-lg font-bold text-white block mt-0.5">91% (Grade A-)</span>
                <span className="text-[10px] text-indigo-400 font-bold block">Top 10% of Cohort tier</span>
              </div>
            </div>

          </div>
        </div>

        {/* Split layouts: billing list left, announcements logs right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Itemized ledger outstanding tuition bills list */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Itemized Tuition Billing & Fees Ledger</h3>
                <span className="text-xs text-slate-550 block">Complete billing file with authorized gateway links</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950/80 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Item Name / Service Category</th>
                    <th className="p-4">Paid Status</th>
                    <th className="p-4 text-center">Amount Due</th>
                    <th className="p-4 text-right">Actions Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-xs">
                  {bills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-slate-950/20 transition">
                      <td className="p-4">
                        <span className="font-bold text-white block">{bill.itemName}</span>
                        <span className="text-[10px] text-slate-500 block">Billing Code: {bill.id} • Date compiled: {bill.status === 'Paid' ? bill.paidDate : 'Overdue Period'}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold block w-max ${
                          bill.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          bill.status === 'Overdue' ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' :
                          'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white text-center font-mono text-[13px]">${bill.amount}</td>
                      <td className="p-4 text-right">
                        {bill.status !== 'Paid' ? (
                          <button
                            type="button"
                            onClick={() => handlePayClick(bill)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 block mr-2">Paid on {bill.paidDate}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Announcements block */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-400 tracking-wider uppercase block mb-1">Campus Announcements</span>
                <h3 className="text-sm font-bold text-white">Advisory Board Bulletin</h3>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 transition rounded-2xl relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-200 block truncate max-w-[180px]">{ann.title}</span>
                      <span className="text-[9px] text-slate-500 font-mono italic">{ann.timeAgo}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-850 text-center text-xs text-slate-500 font-semibold flex items-center justify-between">
              <span>Parent Advisory Line</span>
              <span className="text-indigo-400 hover:underline cursor-pointer flex items-center gap-1 text-[10px]">
                Link Secondary Contact ID <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>

        </div>

      </main>

      {/* Credit Card payment checkout popup simulator */}
      <AnimatePresence>
        {selectedBill && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSelectedBill(null)}
            />

            {/* Checkout modal panel */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto w-full max-w-md h-max bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-50 p-6 text-slate-100"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <CreditCard className="h-4.5 w-4.5 text-indigo-400" /> Secure Payment Gateway
                  </h4>
                  <span className="text-[11px] text-slate-500">Authorize instant bank ledger wire transfers</span>
                </div>
                <button 
                  onClick={() => setSelectedBill(null)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 mb-6 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Checkout Item</span>
                  <span className="text-xs font-bold text-white block max-w-[200px] truncate">{selectedBill.itemName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Total billing</span>
                  <span className="text-base font-extrabold text-white block font-mono">${selectedBill.amount}</span>
                </div>
              </div>

              {/* Credit card fields */}
              <form onSubmit={handleConfirmMockPayment} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Card Number *</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-indigo-500 text-slate-300 font-mono text-center tracking-widest"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Card Holder Identification *</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-indigo-500 text-slate-300 font-sans tracking-wide"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiry Date *</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-indigo-500 text-slate-300 text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Secure CVV *</label>
                    <input
                      type="text"
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-indigo-500 text-slate-300 text-center font-mono"
                    />
                  </div>
                </div>

                {isProcessingPayment ? (
                  <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span>Processing transaction with merchant bank networks...</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5"
                  >
                    Confirm & Remit Outstanding Dues <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
