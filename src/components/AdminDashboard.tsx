import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  GraduationCap, 
  Activity, 
  DollarSign, 
  Plus, 
  Search, 
  Download, 
  Filter, 
  Trash2,
  CheckCircle,
  PlusCircle,
  X,
  Bell,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Student, Teacher, ActivityLog } from '../types';
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

interface AdminDashboardProps {
  students: Student[];
  teachers: Teacher[];
  activityLogs: ActivityLog[];
  onAddStudent: (newStudent: Omit<Student, 'id' | 'avgGrade' | 'progress' | 'initials'>) => void;
  onLogout: () => void;
  onHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  students, 
  teachers, 
  activityLogs, 
  onAddStudent, 
  onLogout,
  onHome
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Inactive'>('All');
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  // Quick enroll input state variables
  const [enrollFirstName, setEnrollFirstName] = useState('');
  const [enrollLastName, setEnrollLastName] = useState('');
  const [enrollGrade, setEnrollGrade] = useState('11th Grade');
  const [enrollSubject, setEnrollSubject] = useState('Advanced Physics');
  const [enrollPhone, setEnrollPhone] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollParentPhone, setEnrollParentPhone] = useState('');

  // Handle addition of student to local state
  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollFirstName || !enrollLastName || !enrollPhone) {
      setAdminNotification('Failed to enroll. Complete the required field validations first.');
      setTimeout(() => setAdminNotification(null), 3000);
      return;
    }

    onAddStudent({
      name: `${enrollFirstName} ${enrollLastName}`,
      grade: enrollGrade,
      subject: enrollSubject,
      phone: enrollPhone,
      email: enrollEmail || `${enrollFirstName.toLowerCase()}@edumanage.com`,
      parentPhone: enrollParentPhone || '14155554921',
      status: 'Active'
    });

    // Reset fields
    setEnrollFirstName('');
    setEnrollLastName('');
    setEnrollPhone('');
    setEnrollEmail('');
    setEnrollParentPhone('');
    setShowEnrollForm(false);
    
    setAdminNotification(`Successfully enrolled ${enrollFirstName} ! Database log initialized.`);
    setTimeout(() => setAdminNotification(null), 4000);
  };

  const filteredStudents = students.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          st.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          st.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' ? true : st.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Simple statistics
  const activeStudentsCount = students.filter(s => s.status === 'Active').length;
  const pendingStudentsCount = students.filter(s => s.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Console Command Header */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-sans font-bold text-base text-white tracking-tight">EduManage CRM</span>
              <span className="text-[10px] block text-slate-500 font-semibold uppercase">{t('Admin Command Node')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-indigo-400 transition relative">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-indigo-500" />
              </button>
            </div>
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <div className="hidden sm:block text-right">
                <span className="text-xs font-semibold text-slate-200 block">{t('System Administrator')}</span>
                <span className="text-[10px] text-slate-500 font-medium font-mono">root_user_01</span>
              </div>
              <LanguageSelector />
              <button 
                onClick={onHome}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 font-semibold rounded-lg transition-transform cursor-pointer"
              >
                {t('Home')}
              </button>
              <button 
                onClick={onLogout}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 font-semibold rounded-lg transition-transform cursor-pointer"
              >
                {t('Sign Out')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Grid Workspace */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8 relative z-10">
        
        {/* Real-time reactive notifications popup */}
        <AnimatePresence>
          {adminNotification && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="bg-indigo-600 border border-indigo-500/30 rounded-2xl p-4 text-white text-xs font-semibold flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-200 animate-spin" />
                <span>{adminNotification}</span>
              </div>
              <button onClick={() => setAdminNotification(null)}>
                <X className="h-4 w-4 text-indigo-200 hover:text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Highlight Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.15)]"
          >
            <div className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">{t('Active Students')}</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">
                <AnimatedCounter value={activeStudentsCount} /> / <AnimatedCounter value={students.length} />
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold">+{pendingStudentsCount} pending</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-[0_10px_20px_-10px_rgba(20,184,166,0.15)]"
          >
            <div className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-teal-600/10 text-teal-400 flex items-center justify-center">
              <Users className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">{t('Educators')}</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">
                <AnimatedCounter value={teachers.length} />
              </span>
              <span className="text-[10px] text-teal-400 font-semibold">100% On Duty</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.15)]"
          >
            <div className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">{t('Fees Receivable')}</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">
                <AnimatedCounter value={2140} prefix="$" />
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">+12% vs last term</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-[0_10px_20px_-10px_rgba(245,158,11,0.15)]"
          >
            <div className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-amber-600/10 text-amber-400 flex items-center justify-center">
              <Activity className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">{t('Audit Records')}</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">
                <AnimatedCounter value={activityLogs.length} /> Logged
              </span>
              <span className="text-[10px] text-amber-400 font-semibold">Real-Time Sync</span>
            </div>
          </motion.div>
        </div>

        {/* Custom SVG Data Visualization Block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart representing seasonal registration stats */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">{t('Enrollment Growth Trend')}</h3>
                <span className="text-[11px] text-slate-500">Student registration loads across standard academic periods</span>
              </div>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">Primary Cohorts</span>
            </div>

            {/* Custom Interactive SVG bar chart using framer motion */}
            <div className="h-56 flex items-end gap-5 sm:gap-7 border-b border-l border-slate-850 px-4 pb-1 pt-6 relative w-full">
              {[
                { period: 'Jan-Feb', count: 4, heightClass: 'h-[40%]', color: 'bg-slate-800' },
                { period: 'Mar-Apr', count: 6, heightClass: 'h-[60%]', color: 'bg-slate-800' },
                { period: 'May-Summer', count: 10, heightClass: 'h-[100%]', color: 'bg-gradient-to-t from-indigo-600 to-indigo-400 animate-pulse' },
                { period: 'Fall Shift', count: 8, heightClass: 'h-[80%]', color: 'bg-slate-800' }
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition duration-200 bg-indigo-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded shadow-lg z-20 pointer-events-none">
                    {bar.count} Students
                  </div>
                  
                  {/* Visual column bar */}
                  <motion.div 
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className={`w-full rounded-t-lg origin-bottom transition-all duration-300 group-hover:brightness-110 ${bar.heightClass} ${bar.color}`}
                  />
                  
                  {/* Label */}
                  <span className="text-[10px] text-slate-500 font-semibold">{bar.period}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Radial Donut chart represented via custom SVG element */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">{t('Budget Ledger Share')}</h3>
              <span className="text-[11px] text-slate-500 block mb-6">Tuition fees balance status across directory profiles</span>
            </div>

            {/* Premium Custom SVG Donut Diagram */}
            <div className="flex justify-center items-center relative h-36">
              <svg className="w-32 h-32 transform -rotate-90">
                {/* Background path */}
                <circle cx="64" cy="64" r="50" fill="transparent" stroke="#1e293b" strokeWidth="12" />
                {/* Active path representing (Paid portion: 65%) */}
                <motion.circle cx="64" cy="64" r="50" fill="transparent" stroke="#6366f1" strokeWidth="12" 
                        strokeDasharray="314" 
                        initial={{ strokeDashoffset: 314 }}
                        animate={{ strokeDashoffset: 110 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeLinecap="round" />
                {/* Pending path (20%) */}
                <motion.circle cx="64" cy="64" r="50" fill="transparent" stroke="#06b6d4" strokeWidth="12" 
                        strokeDasharray="314" 
                        initial={{ strokeDashoffset: 314 }}
                        animate={{ strokeDashoffset: 260 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.25 }}
                        strokeLinecap="round" />
              </svg>
              {/* Abs center labels */}
              <div className="absolute text-center">
                <span className="text-lg font-extrabold text-white block">
                  <AnimatedCounter value={2140} prefix="$" />
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Total</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-slate-400 font-semibold text-center border-t border-slate-850 pt-4">
              <div>
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-1.5" />
                Paid (65%)
              </div>
              <div>
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 mr-1.5" />
                Pending (20%)
              </div>
              <div>
                <span className="inline-block w-2 h-2 rounded-full bg-slate-600 mr-1.5" />
                Overdue (15%)
              </div>
            </div>
          </div>
        </div>

        {/* Directory Controls and Lists */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          
          {/* Filters controls bar */}
          <div className="p-6 border-b border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">{t('Student Enrollment Directory')}</h3>
              <p className="text-xs text-slate-500">Query primary student contact files, class goals, and parent details.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Search Element */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder={t('Query name, grade, standard...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs pl-9 pr-4 py-2 rounded-xl focus:border-indigo-500 outline-none transition"
                />
              </div>

              {/* Status Select */}
              <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs font-semibold">
                {(['All', 'Active', 'Pending'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1 rounded-lg transition capitalize cursor-pointer ${
                      statusFilter === filter 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Toggle new enroll drawer btn */}
              <button
                type="button"
                onClick={() => setShowEnrollForm(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="h-4.5 w-4.5" /> {t('Enroll Student')}
              </button>
            </div>
          </div>

          {/* Directory Listings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Student Profile</th>
                  <th className="p-4">Assigned Subject / Class</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Linked Parent Phone</th>
                  <th className="p-4">Enroll Status</th>
                  <th className="p-4 text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, sIdx) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(sIdx * 0.04, 0.4), duration: 0.3 }}
                      className="hover:bg-slate-950/40 transition"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-900/45 text-indigo-400 border border-indigo-500/20 font-bold flex items-center justify-center">
                            {student.initials || student.name[0]}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{student.name}</span>
                            <span className="text-[10px] text-slate-500 block">{student.grade} • {student.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300 font-medium">{student.subject}</td>
                      <td className="p-4 text-slate-400 font-mono text-[11px]">{student.phone}</td>
                      <td className="p-4 text-slate-500 font-mono text-[11px]">{student.parentPhone || 'Unlinked'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          student.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          student.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          'bg-slate-950 text-slate-500'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${student.progress}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: Math.min(sIdx * 0.04, 0.4) }}
                              className="bg-indigo-500 h-full rounded-full" 
                            />
                          </div>
                          <span className="font-mono text-[10px] text-slate-400">{student.progress}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-500 font-medium bg-slate-950/20">
                      No student records match search query parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs panel & Team listings and details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Active Logs tracking table list */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white">{t('System Security Activity Audits')}</h3>
              <span className="text-[11px] text-slate-550 block">Live database enrollment and transaction transcripts</span>
            </div>

            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {activityLogs.map((log, lIdx) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(lIdx * 0.04, 0.4), duration: 0.3 }}
                  whileHover={{ scale: 1.01, x: 2 }}
                  className="p-3 bg-slate-950 border border-slate-850 hover:border-slate-800 transition rounded-xl flex items-start gap-3.5"
                >
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                    log.type === 'New Enrollment' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                    log.type === 'Fee Payment' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    log.type === 'Payment Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-slate-900 text-slate-400'
                  }`}>
                    {log.type === 'New Enrollment' ? <Plus className="h-4 w-4" /> :
                     log.type === 'Fee Payment' ? <DollarSign className="h-4 w-4" /> :
                     <Activity className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 block truncate">{log.type}</span>
                      <span className="text-[9px] text-slate-500 font-mono whitespace-nowrap">{log.dateTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-sans">{log.detail}</p>
                    {log.amount && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-indigo-400">Ledger balance: -${log.amount}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Teacher Faculty Directory */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="mb-4">
              <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase block mb-1">Academic Faculty</span>
              <h3 className="text-base font-bold text-white">{t('Certified Educators On-Duty')}</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {teachers.map((teacher, tIdx) => (
                <motion.div 
                  key={teacher.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(tIdx * 0.08, 0.4), duration: 0.3 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 transition-all rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <span className="text-sm font-bold text-white block">{teacher.name}</span>
                    <span className="text-xs text-slate-500 block mb-2">{teacher.subject} • {teacher.experience} Experience</span>
                    
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {teacher.courses.map((course, idx) => (
                        <span key={idx} className="bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded text-[9px] font-semibold text-slate-400">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    {teacher.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Slide-out quick enrollment drawer form component */}
      <AnimatePresence>
        {showEnrollForm && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 cursor-ew-resize"
              onClick={() => setShowEnrollForm(false)}
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <PlusCircle className="text-indigo-400 h-5 w-5" /> Quick Student Enrollment
                  </h3>
                  <span className="text-xs text-slate-500">Insert new academic file entries instantly</span>
                </div>
                <button 
                  onClick={() => setShowEnrollForm(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={enrollFirstName}
                      onChange={(e) => setEnrollFirstName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500"
                      placeholder="Penelope"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={enrollLastName}
                      onChange={(e) => setEnrollLastName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500"
                      placeholder="Chen"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Primary Grade Standard *</label>
                  <select
                    value={enrollGrade}
                    onChange={(e) => setEnrollGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-slate-300"
                  >
                    <option>9th Grade</option>
                    <option>10th Grade</option>
                    <option>11th Grade</option>
                    <option>12th Grade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Subject Honors Course</label>
                  <select
                    value={enrollSubject}
                    onChange={(e) => setEnrollSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-slate-300"
                  >
                    <option>Advanced Physics</option>
                    <option>Calculus BC</option>
                    <option>Chemistry Honors</option>
                    <option>AP Literature</option>
                    <option>Organic Chemistry</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Student Contact Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={enrollPhone}
                      onChange={(e) => setEnrollPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500"
                      placeholder="14155559812"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Parent Mobile Contact</label>
                    <input
                      type="tel"
                      value={enrollParentPhone}
                      onChange={(e) => setEnrollParentPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500"
                      placeholder="14155550239"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={enrollEmail}
                    onChange={(e) => setEnrollEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500"
                    placeholder="penelope.chen@edumail.com"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5"
                >
                  Create Academic Profile <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
