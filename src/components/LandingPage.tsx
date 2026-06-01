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
import { useLanguage } from '../LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface LandingPageProps {
  onNavigate: (screen: Screen, initialRole?: Role) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
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
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  };

  const coursesList = [
    {
      title: "Advanced Physics Honors",
      grade: "Grade 11-12",
      desc: "Delve into kinematic vector fields, rotational momentum mechanics, and quantum orbital dynamics models.",
      tutor: "Prof. Alistair Miller",
      theme: {
        bg: "bg-teal-500/10",
        text: "text-teal-400",
        border: "border-teal-500/20",
        hoverBorder: "hover:border-teal-500/50",
        btnBg: "bg-teal-600/10 hover:bg-teal-600 text-teal-300 hover:text-white",
        glow: "bg-teal-500",
        btnBorder: "border-teal-500/30"
      },
      icon: <Activity className="h-5.5 w-5.5" />
    },
    {
      title: "Calculus BC & Analysis",
      grade: "Grade 10-12",
      desc: "Master integration vectors, infinite series limits, polar coordinates, and advanced differential proofs.",
      tutor: "Dr. Sarah Jenkins",
      theme: {
        bg: "bg-indigo-500/10",
        text: "text-indigo-400",
        border: "border-indigo-500/20",
        hoverBorder: "hover:border-indigo-500/50",
        btnBg: "bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white",
        glow: "bg-indigo-500",
        btnBorder: "border-indigo-500/30"
      },
      icon: <ArrowUpRight className="h-5.5 w-5.5" />
    },
    {
      title: "Chemistry & Carbon Rings",
      grade: "Grade 11",
      desc: "Explore atomic orbitals theory, bond dynamic states, molecular synthesis, and basic carbon chains.",
      tutor: "Dr. Evelyn Sterling",
      theme: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
        hoverBorder: "hover:border-emerald-500/50",
        btnBg: "bg-emerald-600/10 hover:bg-emerald-600 text-emerald-300 hover:text-white",
        glow: "bg-emerald-500",
        btnBorder: "border-emerald-500/30"
      },
      icon: <GraduationCap className="h-5.5 w-5.5" />
    },
    {
      title: "AP English Composition",
      grade: "Grade 12",
      desc: "Develop rhetorical argument formats, analyze historic prose works, and write structured academic papers.",
      tutor: "Sarah Jenkins",
      theme: {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/20",
        hoverBorder: "hover:border-amber-500/50",
        btnBg: "bg-amber-600/10 hover:bg-amber-600 text-amber-300 hover:text-white",
        glow: "bg-amber-500",
        btnBorder: "border-amber-500/30"
      },
      icon: <BookOpen className="h-5.5 w-5.5" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">

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
            <span>{t('Unified Management Ecosystem v2.0 is Live')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-white mb-6"
          >
            {t('Where Learning')} <br />
            <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              {t('Meets Success')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
          >
            {t('Connecting Administrators, Tutors, Parents, and Students into a cohesive learning workspace. View reports, compile grades, clear billing invoices, and message teachers in real-time.')}
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
              {t('Start Registration Stepper')}
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {t('Access Multi-Role Dashboards')}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Showcase Workspace Grid */}
      <section className="bg-slate-950 pb-20 border-b border-slate-900" id="ecosystem">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
              {t('Explore Our Live Sub-Portals')}
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              {t('EduManage CRM dynamically routes layouts based on authorized account parameters. Select a client preview node to try immediately.')}
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
                <h3 className="text-lg font-bold text-white mb-2">{t('Administrative CRM')}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {t('Manage standard student directory databases, track fee metrics, monitor real-time security audits and logs, & enroll students securely.')}
                </p>
              </div>
              <button
                onClick={() => onNavigate('login', 'admin')}
                className="w-full py-2.5 px-4 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-medium text-xs rounded-xl transition-all mt-auto flex items-center justify-center gap-1 cursor-pointer"
              >
                {t('Quick Preview CRM Panel')} <ArrowUpRight className="h-3 w-3" />
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
                <h3 className="text-lg font-bold text-white mb-2">{t('Tutor Workspace')}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {t('Log class attendances quickly, record progress indicators, add grades to historic exams, & edit curriculum trackers with zero delay.')}
                </p>
              </div>
              <button
                onClick={() => onNavigate('login', 'tutor')}
                className="w-full py-2.5 px-4 bg-teal-600/10 hover:bg-teal-600 text-teal-350 hover:text-white border border-teal-500/30 font-medium text-xs rounded-xl transition-all mt-auto flex items-center justify-center gap-1 cursor-pointer"
              >
                {t('Launch Tutor Control')} <ArrowUpRight className="h-3 w-3" />
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
                <h3 className="text-lg font-bold text-white mb-2">{t('Parent Portal')}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {t('Track child metrics (attendance gauges, homework grades), review notifications transcripts, pay bills & invoices via payment gateways.')}
                </p>
              </div>
              <button
                onClick={() => onNavigate('login', 'parent')}
                className="w-full py-2.5 px-4 bg-amber-600/10 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 font-medium text-xs rounded-xl transition-all mt-auto flex items-center justify-center gap-1 cursor-pointer"
              >
                {t('Configure Parent Linkage')} <ArrowUpRight className="h-3 w-3" />
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
                <h3 className="text-lg font-bold text-white mb-2">{t('Student Portal')}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {t('View customized curricula, monitor active homework completions, check class schedules, and simulate communication using active support channels.')}
                </p>
              </div>
              <button
                onClick={() => onNavigate('login', 'student')}
                className="w-full py-2.5 px-4 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-medium text-xs rounded-xl transition-all mt-auto flex items-center justify-center gap-1 cursor-pointer"
              >
                {t('Access Learning Board')} <ArrowUpRight className="h-3 w-3" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Courses Section with Animated Cards */}
      <section className="bg-slate-950/65 py-24 border-b border-slate-900" id="courses">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest block mb-2 animate-pulse">
              {t('Curated Syllabus Programs')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              {t('Academic Courses Provided')}
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">
              {t('Discover our advanced, tutor-led honors courses. Click to start learning or view course specifics instantly.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coursesList.map((course, idx) => (
              <motion.div
                key={idx}
                className={`bg-slate-900/60 rounded-3xl p-6 border ${course.theme.border} ${course.theme.hoverBorder} transition-all flex flex-col justify-between relative overflow-hidden group cursor-pointer`}
                whileHover={{ y: -10, scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: idx * 0.1 }}
              >
                {/* Accent Background Glow */}
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 pointer-events-none ${course.theme.glow}`} />

                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${course.theme.bg} ${course.theme.text} border ${course.theme.border}`}>
                    {course.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${course.theme.bg} ${course.theme.text} px-2 py-0.5 rounded-md inline-block mb-3`}>
                    {course.grade}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-450 text-xs leading-relaxed mb-6">
                    {course.desc}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold border-t border-slate-850 pt-4">
                    <span>{t('Instructed by:')}</span>
                    <span className="text-slate-300">{course.tutor}</span>
                  </div>
                  <button
                    onClick={() => onNavigate('login')}
                    className={`w-full py-2.5 px-4 ${course.theme.btnBg} border ${course.theme.btnBorder} font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
                  >
                    {t('Enroll Now')} <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Unified Features Bento Grid Section */}
      <section className="py-20 w-full px-4 sm:px-8 lg:px-12" id="features">
        <div className="mb-12 text-left md:text-center">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest block mb-2">
            {t('CRM Core Capabilities')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {t('Engineered for Academic Precision and Operations')}
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
                {t('Comprehensive Accounting')}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {t('Seamless Payment Linkages for Outstanding Dues')}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-lg mb-6">
                {t('Say goodbye to complicated tuition billing. Administrators issue itemized billing ledgers while parents receive real-time notifications to complete secure payment gateways instantly inside the dashboard.')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
                <span className="text-slate-200 text-sm font-semibold block">{t('Itemized Billing')}</span>
                <span className="text-xs text-slate-500">{t('Automated invoices')}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
                <span className="text-slate-200 text-sm font-semibold block">{t('Direct Remittance')}</span>
                <span className="text-xs text-slate-500 border-none">{t('Real-time status transitions')}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
                <span className="text-slate-200 text-sm font-semibold block">{t('Declined Card Logs')}</span>
                <span className="text-xs text-slate-500">{t('Admin audit trail')}</span>
              </div>
            </div>
          </div>

          {/* Feature 2: High fidelity charts */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <span className="text-xs text-teal-400 font-bold bg-teal-500/10 px-2.5 py-1 rounded-md mb-6 inline-block">
                {t('Advanced Visualization')}
              </span>
              <h3 className="text-xl font-bold text-white mb-3">{t('Interactive Growth Metrics')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t('Generate responsive enrollment visualizations dynamically. Admins can view seasonal registration statistics and budget statuses immediately under animated, vector SVG graphs.')}
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
        <div className="w-full px-4 sm:px-8 lg:px-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <span className="block text-4xl font-extrabold text-white tracking-tight">1,250+</span>
              <span className="mt-1.5 block text-sm text-slate-500">{t('Enrolled Students')}</span>
            </div>
            <div>
              <span className="block text-4xl font-extrabold text-white tracking-tight">99.4%</span>
              <span className="mt-1.5 block text-sm text-slate-500">{t('Attendance Rate')}</span>
            </div>
            <div>
              <span className="block text-4xl font-extrabold text-white tracking-tight">140+</span>
              <span className="mt-1.5 block text-sm text-slate-500">{t('Certified Educators')}</span>
            </div>
            <div>
              <span className="block text-4xl font-extrabold text-white tracking-tight">12 sec</span>
              <span className="mt-1.5 block text-sm text-slate-500">{t('Parent Link Verification')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="w-full px-4 sm:px-8 lg:px-12 text-center md:flex md:items-center md:justify-between text-xs text-slate-500">
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-0">
            <GraduationCap className="h-5 w-5 text-indigo-500" />
            <span className="text-slate-300 font-bold">{t('EduManage Academic Group LTD')}</span>
          </div>
          <div>
            <span>&copy; {new Date().getFullYear()} {t('EduManage CRM. Built for Next-Generation Learning Organizations. All rights reserved.')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
