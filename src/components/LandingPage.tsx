import React from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Activity, 
  Shield, 
  PlusSquare, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  CheckCircle,
  Menu,
  ArrowUpRight
} from 'lucide-react';
import { Screen, Role } from '../types';

interface LandingPageProps {
  onNavigate: (screen: Screen, initialRole?: Role) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-sans font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
                EduManage
              </span>
              <span className="text-xs block text-slate-500 font-medium">Academic CRM</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-slate-100 transition-colors">Features</a>
            <a href="#ecosystem" className="hover:text-slate-100 transition-colors">Portals</a>
            <a href="#stats" className="hover:text-slate-100 transition-colors">Metrics</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('login')}
              className="px-4 py-2 text-sm text-slate-300 font-medium hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-400 mb-8"
          >
            <Sparkles className="h-3 w-3 text-indigo-400" />
            <span>Unified Management Ecosystem v2.0 is Live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-white mb-6"
          >
            Empowering Education through <br />
            <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Intelligent Management crm
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
          >
            Connecting Administrators, Tutors, Parents, and Students into a cohesive learning workspace. View reports, compile grades, clear billing invoices, and message teachers in real-time.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Start Registration Stepper
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Access Multi-Role Dashboards
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Showcase Workspace Grid */}
      <section className="bg-slate-950 pb-20 border-b border-slate-900" id="ecosystem">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
              Explore Our Live Sub-Portals
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              EduManage CRM dynamically routes layouts based on authorized account parameters. Select a client preview node to try immediately.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Admin Portal Info Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-indigo-900/40 text-indigo-400 rounded-xl flex items-center justify-center mb-5 border border-indigo-500/30">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Administrative CRM</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Manage standard student directory databases, track fee metrics, monitor real-time security audits and logs, & enroll students securely.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('login', 'admin')}
                className="w-full py-2.5 px-4 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-medium text-xs rounded-xl transition-all mt-auto flex items-center justify-center gap-1 cursor-pointer"
              >
                Quick Preview CRM Panel <ArrowUpRight className="h-3 w-3" />
              </button>
            </motion.div>

            {/* Tutor Dashboard Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-slate-900/60 p-6 rounded-2xl border border-teal-500/20 hover:border-teal-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-teal-900/40 text-teal-400 rounded-xl flex items-center justify-center mb-5 border border-teal-500/30">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Tutor Workspace</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Log class attendances quickly, record progress indicators, add grades to historic exams, & edit curriculum trackers with zero delay.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('login', 'tutor')}
                className="w-full py-2.5 px-4 bg-teal-600/10 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-500/30 font-medium text-xs rounded-xl transition-all mt-auto flex items-center justify-center gap-1 cursor-pointer"
              >
                Launch Tutor Control <ArrowUpRight className="h-3 w-3" />
              </button>
            </motion.div>

            {/* Parent Linkage Portal */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-slate-900/60 p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-amber-900/40 text-amber-400 rounded-xl flex items-center justify-center mb-5 border border-amber-500/30">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Parent Portal</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Track child metrics (attendance gauges, homework grades), review notifications transcripts, pay bills & invoices via payment gateways.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('login', 'parent')}
                className="w-full py-2.5 px-4 bg-amber-600/10 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 font-medium text-xs rounded-xl transition-all mt-auto flex items-center justify-center gap-1 cursor-pointer"
              >
                Configure Parent Linkage <ArrowUpRight className="h-3 w-3" />
              </button>
            </motion.div>

            {/* Student Learning Portal */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-slate-900/60 p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-emerald-900/40 text-emerald-400 rounded-xl flex items-center justify-center mb-5 border border-emerald-500/30">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Student Portal</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  View customized curricula, monitor active homework completions, check class schedules, and simulate communication using active support channels.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('login', 'student')}
                className="w-full py-2.5 px-4 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-medium text-xs rounded-xl transition-all mt-auto flex items-center justify-center gap-1 cursor-pointer"
              >
                Access Learning Board <ArrowUpRight className="h-3 w-3" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Unified Features Bento Grid Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="features">
        <div className="mb-12 text-left md:text-center">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest block mb-2">
            CRM Core Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Engineered for Academic Precision and Operations
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main feature highlight spanning 2 columns */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <PlusSquare className="h-64 w-64 text-indigo-400 translate-x-12 translate-y-12" />
            </div>
            <div>
              <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-md mb-6 inline-block">
                Comprehensive Accounting
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Seamless Payment Linkages for Outstanding Dues
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-lg mb-6">
                Say goodbye to complicated tuition billing. Administrators issue itemized billing ledgers while parents receive real-time notifications to complete secure payment gateways instantly inside the dashboard.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
                <span className="text-slate-200 text-sm font-semibold block">Itemized Billing</span>
                <span className="text-xs text-slate-500">Automated invoices</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
                <span className="text-slate-200 text-sm font-semibold block">Direct Remittance</span>
                <span className="text-xs text-slate-500 border-none">Real-time status transitions</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
                <span className="text-slate-200 text-sm font-semibold block">Declined Card Logs</span>
                <span className="text-xs text-slate-500">Admin audit trail</span>
              </div>
            </div>
          </div>

          {/* Feature 2: High fidelity charts */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <span className="text-xs text-teal-400 font-bold bg-teal-500/10 px-2.5 py-1 rounded-md mb-6 inline-block">
                Advanced Visualization
              </span>
              <h3 className="text-xl font-bold text-white mb-3">Interactive Growth Metrics</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generate responsive enrollment visualizations dynamically. Admins can view seasonal registration statistics and budget statuses immediately under animated, vector SVG graphs.
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mt-6 flex items-center justify-center h-28">
              {/* Minimalist preview of custom SVG charts */}
              <div className="flex items-end gap-3 h-16 w-full px-4">
                <div className="w-full bg-slate-800 rounded-t h-1/3"></div>
                <div className="w-full bg-slate-800 rounded-t h-1/2"></div>
                <div className="w-full bg-indigo-500 rounded-t h-4/5 animate-pulse"></div>
                <div className="w-full bg-slate-800 rounded-t h-2/3"></div>
                <div className="w-full bg-teal-500 rounded-t h-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-slate-900/40 border-y border-slate-900 py-16" id="stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <span className="block text-4xl font-extrabold text-white tracking-tight">1,250+</span>
              <span className="mt-1.5 block text-sm text-slate-500">Enrolled Students</span>
            </div>
            <div>
              <span className="block text-4xl font-extrabold text-white tracking-tight">99.4%</span>
              <span className="mt-1.5 block text-sm text-slate-500">Attendance Rate</span>
            </div>
            <div>
              <span className="block text-4xl font-extrabold text-white tracking-tight">140+</span>
              <span className="mt-1.5 block text-sm text-slate-500">Certified Educators</span>
            </div>
            <div>
              <span className="block text-4xl font-extrabold text-white tracking-tight">12 sec</span>
              <span className="mt-1.5 block text-sm text-slate-500">Parent Link Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:flex md:items-center md:justify-between text-xs text-slate-500">
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-0">
            <GraduationCap className="h-5 w-5 text-indigo-500" />
            <span className="text-slate-300 font-bold">EduManage Academic Group LTD</span>
          </div>
          <div>
            <span>&copy; {new Date().getFullYear()} EduManage CRM. Built for Next-Generation Learning Organizations. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
