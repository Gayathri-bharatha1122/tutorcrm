import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
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
import { useLanguage } from '../LanguageContext';
import { LanguageSelector } from './LanguageSelector';

const AnimatedCounter: React.FC<{ value: number; duration?: number; prefix?: string; suffix?: string; decimals?: number }> = ({ value, duration = 1000, prefix = '', suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = progress * value;
      setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration, decimals]);

  const displayVal = decimals > 0 ? count.toFixed(decimals) : count.toLocaleString();
  return <>{prefix}{displayVal}{suffix}</>;
};

interface ParentDashboardProps {
  parentName: string;
  studentName: string;
  currentPath?: string;
  onLogout: () => void;
  onHome: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  parentName,
  studentName,
  currentPath,
  onLogout,
  onHome
}) => {
  const { t } = useLanguage();
  const [bills, setBills] = useState<Bill[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [linkedStudentName, setLinkedStudentName] = useState<string>(studentName);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, billsData] = await Promise.all([
          api.getParentDashboard(),
          api.getParentBills()
        ]);
        setAnnouncements(dashboardData.announcements || []);
        setBills(billsData || []);
        if (dashboardData.student?.name) {
          setLinkedStudentName(dashboardData.student.name);
        }
      } catch (err) {
        console.error("Failed to load parent data", err);
      }
    };
    fetchData();
  }, []);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'announcements' | 'messages'>('announcements');
  
  useEffect(() => {
    if (currentPath) {
      if (currentPath.includes('/messages') || currentPath.includes('/teachers')) setActiveTab('messages');
      else setActiveTab('announcements');
    }
  }, [currentPath]);
  
  // Card details mock states
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4921');
  const [cardHolder, setCardHolder] = useState('HELENA THORNE');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvv, setCardCvv] = useState('642');

  const handlePayClick = (bill: Bill) => {
    setSelectedBill(bill);
    setPaymentSuccessMessage(null);
  };

  const handleConfirmMockPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill) return;

    setIsProcessingPayment(true);

    try {
      await api.payBill(selectedBill.id);
      const updatedBills = await api.getParentBills();
      setBills(updatedBills);

      setIsProcessingPayment(false);
      setSelectedBill(null);
      
      setPaymentSuccessMessage(`Payment for "${selectedBill.itemName}" processed successfully. Invoiced balance cleared.`);
      setTimeout(() => setPaymentSuccessMessage(null), 4000);
    } catch (err: any) {
      setIsProcessingPayment(false);
      alert(`Payment failed: ${err.message}`);
    }
  };

  // Compute Outstanding Dues Surcharge
  const totalOutstanding = bills
    .filter((b) => b.status === 'Pending' || b.status === 'Overdue')
    .reduce((sum, b) => sum + b.amount, 0);

  // Predefined attendance data for May 2026
  // Starts on a Friday (5 empty days padding)
  const getMay2026Attendance = () => {
    const days = [];
    // Padding
    for (let i = 0; i < 5; i++) {
      days.push({ dayNum: null, status: 'empty' });
    }
    const absentDays = [8, 20];
    for (let d = 1; d <= 31; d++) {
      const dayOfWeek = (5 + d - 1) % 7;
      let status: 'present' | 'absent' | 'weekend' = 'present';
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        status = 'weekend';
      } else if (absentDays.includes(d)) {
        status = 'absent';
      }
      days.push({ dayNum: d, status });
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Upper Navigation bars */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-sans font-bold text-base text-white tracking-tight">EduManage Parent</span>
              <span className="text-[10px] block text-slate-500 font-semibold uppercase">{t('Guardian Link Account')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-200 block">{parentName}</span>
                <span className="text-[10px] text-amber-400 font-bold uppercase font-mono">Linked Child • {linkedStudentName}</span>
              </div>
              <LanguageSelector />
              <button 
                onClick={onHome}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-semibold rounded-lg transition cursor-pointer"
              >
                {t('Home')}
              </button>
              <button 
                onClick={onLogout}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-semibold rounded-lg transition cursor-pointer"
              >
                {t('Sign Out')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8 relative z-10">
        
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
              <h2 className="text-xl font-bold text-white">{linkedStudentName === 'Marcus Thorne' ? t('Student Progress Directory: Marcus Thorne') : `${t('Student Progress Directory')}: ${linkedStudentName}`}</h2>
              <p className="text-slate-400 text-xs">Educational metrics synchronized directly with Prof. Alistair Miller's study journals.</p>
            </div>

            {/* Total Balance block */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex items-center justify-between gap-6 w-full sm:min-w-xs shrink-0">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">{t('Outstanding Balance Due')}</span>
                <span className="text-2xl font-extrabold text-white block">
                  <AnimatedCounter value={totalOutstanding} prefix="$" />
                </span>
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
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 flex items-center gap-4 transition-all hover:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.1)] cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{t('Attendance Rate')}</span>
                <span className="text-lg font-bold text-white block mt-0.5">
                  <AnimatedCounter value={98.2} decimals={1} suffix="%" />
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block">Excellent • Standard Class 11B</span>
              </div>
            </motion.div>

            {/* Metric 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 flex items-center gap-4 transition-all hover:shadow-[0_10px_20px_-10px_rgba(20,184,166,0.1)] cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{t('Homework Completion')}</span>
                <span className="text-lg font-bold text-white block mt-0.5">
                  <AnimatedCounter value={94.1} decimals={1} suffix="%" />
                </span>
                <span className="text-[10px] text-teal-400 font-bold block">Highly Consistent • +3% vs. Avg</span>
              </div>
            </motion.div>

            {/* Metric 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 flex items-center gap-4 transition-all hover:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{t('Average Course Grades')}</span>
                <span className="text-lg font-bold text-white block mt-0.5">
                  <AnimatedCounter value={91} suffix="% (Grade A-)" />
                </span>
                <span className="text-[10px] text-indigo-400 font-bold block">Top 10% of Cohort tier</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Attendance Calendar Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block bg-emerald-500/10 w-max px-2.5 py-0.5 rounded-md">
                Attendance Log
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                <Calendar className="h-5 w-5 text-emerald-400" /> {t('Attendance Calendar')}
              </h3>
              <p className="text-slate-400 text-xs">Verify your child's daily presence and session check-ins for the current month.</p>
            </div>
            <div className="flex flex-wrap gap-3 text-[10px] font-semibold text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Present</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Absent</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-700" /> Weekend</span>
            </div>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-850 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Calendar Left */}
              <div className="w-full max-w-xs mx-auto md:mx-0">
                <div className="text-center font-bold text-xs text-slate-350 mb-3">May 2026</div>
                <div className="grid grid-cols-7 gap-1.5 text-center text-[9px] font-bold text-slate-500 mb-2">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center justify-items-center">
                  {getMay2026Attendance().map((day, idx) => {
                    if (day.status === 'empty') {
                      return <div key={`empty-${idx}`} className="w-8 h-8" />;
                    }
                    
                    let cellStyle = "";
                    if (day.status === 'present') {
                      cellStyle = "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full";
                    } else if (day.status === 'absent') {
                      cellStyle = "bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-full";
                    } else {
                      cellStyle = "bg-slate-900/30 text-slate-500 border border-slate-900/50 rounded-full";
                    }

                    return (
                      <div
                        key={`day-${day.dayNum}`}
                        title={day.status === 'present' ? `Present on May ${day.dayNum}` : day.status === 'absent' ? `Absent on May ${day.dayNum}` : `Weekend`}
                        className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold font-mono transition-all hover:scale-110 cursor-pointer ${cellStyle}`}
                      >
                        {day.dayNum}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attendance Statistics Right */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2">May Attendance Stats</h4>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900/55 p-3 rounded-xl border border-slate-850 text-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Conducted</span>
                    <span className="text-sm font-extrabold text-white block mt-1">
                      <AnimatedCounter value={21} />
                    </span>
                    <span className="text-[8px] text-slate-400 block font-semibold">Sessions</span>
                  </div>
                  
                  <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/10 text-center">
                    <span className="text-[9px] font-bold text-emerald-550 uppercase block">Attended</span>
                    <span className="text-sm font-extrabold text-emerald-400 block mt-1">
                      <AnimatedCounter value={19} />
                    </span>
                    <span className="text-[8px] text-emerald-500/70 block font-semibold">Present</span>
                  </div>

                  <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-500/10 text-center">
                    <span className="text-[9px] font-bold text-rose-550 uppercase block">Absent</span>
                    <span className="text-sm font-extrabold text-rose-400 block mt-1">
                      <AnimatedCounter value={2} />
                    </span>
                    <span className="text-[8px] text-rose-500/70 block font-semibold">Missed</span>
                  </div>
                </div>

                {/* Attendance Ratio Circular Gauge & Text */}
                <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-850/60">
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg className="w-14 h-14 transform -rotate-90">
                      <circle cx="28" cy="28" r="22" fill="transparent" stroke="#1e293b" strokeWidth="3.5" />
                      <motion.circle cx="28" cy="28" r="22" fill="transparent" strokeWidth="3.5"
                              className="stroke-emerald-400 transition-all duration-1000"
                              initial={{ strokeDashoffset: 138 }}
                              animate={{ strokeDashoffset: 138 - (138 * 90.5) / 100 }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                              strokeDasharray="138"
                              strokeLinecap="round" />
                    </svg>
                    <span className="absolute font-mono text-[9px] font-extrabold text-slate-350">
                      <AnimatedCounter value={90.5} decimals={1} suffix="%" />
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Attendance Percentage</span>
                    <p className="text-[10px] text-slate-400 leading-snug">Attended 19 out of 21 sessions. {linkedStudentName}'s attendance is above the 90% threshold.</p>
                  </div>
                </div>
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
                <h3 className="text-sm font-bold text-white">{t('Itemized Tuition Billing & Fees Ledger')}</h3>
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
                  {bills.map((bill, bIdx) => (
                    <motion.tr 
                      key={bill.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(bIdx * 0.05, 0.4), duration: 0.3 }}
                      className="hover:bg-slate-950/20 transition"
                    >
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
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg transition hover:scale-[1.03] active:scale-[0.97] btn-shine-effect btn-ripple cursor-pointer"
                          >
                            {t('Pay Now')}
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 block mr-2">Paid on {bill.paidDate}</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Announcements block */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex gap-2 mb-2">
                  <button 
                    onClick={() => setActiveTab('announcements')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'announcements' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Campus Announcements
                  </button>
                  <button 
                    onClick={() => setActiveTab('messages')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'messages' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Direct Messages
                  </button>
                </div>
                <h3 className="text-sm font-bold text-white mt-4">{activeTab === 'announcements' ? t('Advisory Board Bulletin') : t('Teacher Communications')}</h3>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {activeTab === 'announcements' ? (
                  announcements.map((ann, aIdx) => (
                    <motion.div 
                      key={ann.id}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(aIdx * 0.05, 0.4), duration: 0.3 }}
                      whileHover={{ x: 2, scale: 1.01 }}
                      className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 transition rounded-2xl relative"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-200 block truncate max-w-[180px]">{ann.title}</span>
                        <span className="text-[9px] text-slate-500 font-mono italic">{ann.timeAgo}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{ann.content}</p>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-200 block">Prof. Alistair Miller</span>
                      <span className="text-[9px] text-slate-500 font-mono italic">Today, 10:30 AM</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Marcus has been doing exceptionally well in his rotational physics units. Let's touch base next week regarding the upcoming science fair.</p>
                    <button className="mt-2 text-[10px] bg-amber-600/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg font-bold hover:bg-amber-600/20 hover:scale-[1.03] active:scale-[0.97] transition-all self-start cursor-pointer btn-ripple">Reply to Message</button>
                  </motion.div>
                )}
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
                    <CreditCard className="h-4.5 w-4.5 text-indigo-400" /> {t('Secure Payment Gateway')}
                  </h4>
                  <span className="text-[11px] text-slate-550">{t('Authorize instant bank ledger wire transfers')}</span>
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
                    {t('Confirm & Remit Outstanding Dues')} <ArrowRight className="h-4 w-4" />
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
