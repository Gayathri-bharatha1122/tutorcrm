import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Phone, 
  Mail, 
  Lock, 
  ChevronRight,
  Database,
  RefreshCw,
  Sparkles,
  Award
} from 'lucide-react';
import { Screen, Role, Student } from '../types';
import { useLanguage } from '../LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { initialStudents } from '../data';

interface RegisterStepperProps {
  onNavigate: (screen: Screen) => void;
  onRegisteredSuccess: (role: Role, customName: string) => void;
}

export const RegisterStepper: React.FC<RegisterStepperProps> = ({ onNavigate, onRegisteredSuccess }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [roleType, setRoleType] = useState<'student' | 'parent'>('student');
  
  // General inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Student specific inputs
  const [grade, setGrade] = useState('11th Grade');
  const [learningGoal, setLearningGoal] = useState('Excel in Physics mechanics and prepare for final SAT assessment');
  const [parentPhoneInput, setParentPhoneInput] = useState('');

  // Parent specific: Student Search Linkage
  const [studentLookupPhone, setStudentLookupPhone] = useState('14155550218'); // Defaults to Marcus' phone for testing ease
  const [linkedStudent, setLinkedStudent] = useState<Student | null>(null);
  const [lookupFeedback, setLookupFeedback] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(59);

  // OTP Timer side effects
  useEffect(() => {
    let interval: any;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  const handleSearchStudent = () => {
    if (!studentLookupPhone) {
      setLookupFeedback('Please fill in a valid student phone query.');
      setLinkedStudent(null);
      return;
    }
    const sanitized = studentLookupPhone.replace(/\D/g, '');
    const found = initialStudents.find(st => st.phone.includes(sanitized) || sanitized.includes(st.phone));
    
    if (found) {
      setLinkedStudent(found);
      setLookupFeedback(null);
      setOtpSent(true);
      setOtpTimer(59);
    } else {
      setLinkedStudent(null);
      setLookupFeedback('No active student found with that register phone ID in the campus database. Try "14155550218" for demonstration!');
    }
  };

  const handleVerifyOtp = () => {
    if (otpCode === '6423' || otpCode === '1234') {
      setOtpVerified(true);
      setLookupFeedback(null);
    } else {
      setLookupFeedback('Invalid security OTP verification token. Try matching "6423" passcode.');
    }
  };

  const executeCompleteRegistration = () => {
    // Collect Name, persist custom registration output and trigger redirect
    const finalName = `${firstName || (roleType === 'parent' ? 'Helena' : 'Marcus')} ${lastName || (roleType === 'parent' ? 'Thorne' : 'Thorne')}`;
    onRegisteredSuccess(roleType, finalName);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden font-sans">
      
      {/* Background radial effects */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-slate-900/60 blur-[100px] pointer-events-none" />

      {/* Brand logo back to landing link */}
      <div 
        onClick={() => onNavigate('landing')} 
        className="flex items-center gap-2 mb-8 cursor-pointer hover:scale-105 transition-all relative z-10"
      >
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="font-sans font-bold text-lg text-white tracking-tight">EduManage System</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-8 relative z-10 shadow-2xl text-slate-100"
      >
        {/* Progress Bar Track */}
        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-6 border border-slate-850">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
            initial={{ width: '33.33%' }}
            animate={{ width: currentStep === 1 ? '33.33%' : currentStep === 2 ? '66.66%' : '100%' }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
        </div>

        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-800/80 pb-5">
          <div className="flex gap-1 items-center text-xs text-indigo-400 font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{currentStep === 1 ? t('Step 1 of 3 • Credential Type') : currentStep === 2 ? t('Step 2 of 3 • Profile Registry') : t('Step 3 of 3 • Validation Links')}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-3 py-1 rounded-full">
            <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
            <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
            <div className={`w-2 h-2 rounded-full ${currentStep >= 3 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
          </div>
        </div>

        {/* Dynamic Content Stages */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-1.5">{t('Select Your Account Type')}</h3>
                <p className="text-sm text-slate-400">{t('Choose between Student or Parent role. EduManage delivers tailored boards based on selection parameters.')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Student Select Card */}
                <motion.div
                  whileHover={{ scale: 1.03, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRoleType('student')}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-44 ${
                    roleType === 'student'
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-950/20 hover:border-indigo-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${roleType === 'student' ? 'bg-indigo-600/30 text-indigo-400' : 'bg-slate-900 text-slate-400'}`}>
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    {roleType === 'student' && <CheckCircle className="h-5 w-5 text-indigo-400 shrink-0" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{t('Student Portal Profile')}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{t('Complete assignment lists, query support tools directly, and track exam updates.')}</p>
                  </div>
                </motion.div>

                {/* Parent Select Card */}
                <motion.div
                  whileHover={{ scale: 1.03, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRoleType('parent')}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-44 ${
                    roleType === 'parent'
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-950/20 hover:border-indigo-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${roleType === 'parent' ? 'bg-indigo-600/30 text-indigo-400' : 'bg-slate-900 text-slate-400'}`}>
                      <User className="h-5 w-5" />
                    </div>
                    {roleType === 'parent' && <CheckCircle className="h-5 w-5 text-indigo-400 shrink-0" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{t('Parent Guardian Link')}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{t('Monitor learning attendance metrics, verify unpaid fee balances, and review reports.')}</p>
                  </div>
                </motion.div>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 flex items-center gap-3">
                <Database className="h-5 w-5 text-indigo-400 shrink-0" />
                <span className="text-slate-400 text-xs leading-normal">
                  Our system verifies academic linkage via active cellular numbers registered by campus administrators. No administrative paperwork needed.
                </span>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate('landing')}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-850 rounded-xl text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-ripple"
                >
                  <ArrowLeft className="h-4 w-4" /> {t('Back to Home')}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white cursor-pointer shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 group hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple"
                >
                  {t('Continue Profile Creation')}
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-bold text-white">{t('Registry Profile Details')}</h3>
                <p className="text-xs text-slate-500">{t('Provide legal identification and access keys for account verification checks.')}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('First Name')}</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-sm px-4 py-2 rounded-xl focus:border-indigo-500 outline-none transition input-focus-glow"
                    placeholder="Helena"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Last Name')}</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-sm px-4 py-2 rounded-xl focus:border-indigo-500 outline-none transition input-focus-glow"
                    placeholder="Thorne"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Contact Email Address')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:border-indigo-500 outline-none transition input-focus-glow"
                      placeholder="helena@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Primary Phone Number')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:border-indigo-500 outline-none transition input-focus-glow"
                      placeholder="14155554921"
                    />
                  </div>
                </div>
              </div>

              {/* Conditional Inputs based on Role Selected */}
              {roleType === 'student' ? (
                <div className="space-y-4 pt-2 border-t border-slate-850">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Grade Standard')}</label>
                      <select 
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full bg-slate-950 text-slate-200 text-xs p-2.5 rounded-xl border border-slate-850 outline-none focus:border-indigo-500 transition input-focus-glow"
                      >
                        <option>9th Grade</option>
                        <option>10th Grade</option>
                        <option>11th Grade</option>
                        <option>12th Grade</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Parent Mobile Contact (Optional)')}</label>
                      <input
                        type="tel"
                        value={parentPhoneInput}
                        onChange={(e) => setParentPhoneInput(e.target.value)}
                        className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-xs p-2.5 rounded-xl focus:border-indigo-500 outline-none transition input-focus-glow"
                        placeholder="14155554921"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Learning Motivation Target')}</label>
                    <textarea
                      value={learningGoal}
                      onChange={(e) => setLearningGoal(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-xs p-3 rounded-xl focus:border-indigo-500 outline-none transition resize-none input-focus-glow"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-400 block mb-1">🛡️ {t('Linkage Policy Acknowledgement')}</span>
                  As a registered Parent / Guardian, completing Step 3 requires entering your child's mobile number. EduManage CRM's automatic lookup matches files instantly for security audits.
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Secure Control Key Password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:border-indigo-500 outline-none transition input-focus-glow"
                    placeholder="Create dashboard key password"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-850 rounded-xl text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-ripple"
                >
                  <ArrowLeft className="h-4 w-4" /> {t('Back')}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple"
                >
                  {t('Next: Validation Links')} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {roleType === 'student' ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20"
                    >
                      <GraduationCap className="h-8 w-8 text-indigo-400" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-white">Student Pre-Approval Complete!</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">No cellular linkages required. Student registration uses parent backup contacts to bypass SMS wait queues.</p>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-950/80 p-5 rounded-2xl border border-slate-850 space-y-2"
                  >
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Registry Summary</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-slate-400">FullName:</span> <span className="text-slate-200 font-semibold">{firstName || 'Marcus'} {lastName || 'Thorne'}</span></div>
                      <div><span className="text-slate-400">Standard:</span> <span className="text-slate-200 font-semibold">{grade}</span></div>
                      <div className="col-span-2 text-[11px] border-t border-slate-900 pt-2 text-slate-500">
                        <span className="font-bold text-slate-400">Target Curriculum:</span> Applied general science vectors & Advanced BC Calculus assessments.
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Database Linkage Verification Lookup</h3>
                    <p className="text-xs text-slate-400">Provide your child's mobile number registered with academic records to bind accounting metrics.</p>
                  </div>

                  {/* lookup interface */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Registered Student Mobile Key</label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={studentLookupPhone}
                          onChange={(e) => setStudentLookupPhone(e.target.value)}
                          className="bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 flex-1 transition input-focus-glow"
                          placeholder="e.g., 14155550218"
                        />
                        <button
                          type="button"
                          onClick={handleSearchStudent}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 transition-all text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple"
                        >
                          <RefreshCw className="h-3 w-3 animate-spin" /> Search Directory
                        </button>
                      </div>
                    </div>

                    {/* Lookup matches */}
                    {linkedStudent && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-3 overflow-hidden"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-xs text-slate-400">Student Profile Found in Database</span>
                            <span className="font-bold text-emerald-300 block text-sm">{linkedStudent.name} ({linkedStudent.grade})</span>
                            <span className="text-[11px] text-slate-500 block">Enrolled in: {linkedStudent.subject} • Tutor: Prof. Miller</span>
                          </div>
                        </div>

                        {/* OTP Verification simulated box */}
                        {otpSent && !otpVerified && (
                          <div className="border-t border-emerald-500/20 pt-3 space-y-3">
                            <span className="text-[11px] font-semibold text-slate-400 block">🔐 Sent validation One-Time Password to student's mobile</span>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Enter Verification Code"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                className="bg-slate-950 border border-slate-800 text-white font-mono text-center tracking-widest text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 w-36 transition input-focus-glow"
                              />
                              <button
                                type="button"
                                onClick={handleVerifyOtp}
                                className="px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple"
                              >
                                Link Profile
                              </button>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span>Default OTP code: <strong className="font-medium text-slate-300">6423</strong></span>
                              <span>Resend in {otpTimer}s</span>
                            </div>
                          </div>
                        )}

                        {otpVerified && (
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 150, damping: 15 }}
                            className="bg-indigo-500/10 border border-indigo-400/30 p-2.5 rounded-lg flex items-center gap-2"
                          >
                            <Award className="h-4 w-4 text-indigo-400 shrink-0" />
                            <span className="text-[11px] text-indigo-200 font-semibold leading-normal">
                              Linkage established! Parent database linkage authorized for {linkedStudent.name}.
                            </span>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {lookupFeedback && (
                      <p className="text-[11px] text-red-400 font-medium font-sans leading-relaxed text-center px-2">{lookupFeedback}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-850 rounded-xl text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-ripple"
                >
                  <ArrowLeft className="h-4 w-4" /> {t('Back')}
                </button>
                <button
                  type="button"
                  disabled={roleType === 'parent' && !otpVerified}
                  onClick={executeCompleteRegistration}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    roleType === 'parent' && !otpVerified
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/10 hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple'
                  }`}
                >
                  {t('Finalize Enrollment')} <CheckCircle className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Stepper switcher backer */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-500 font-semibold">
          <span>{t('Remembered login details?')} </span>
          <button 
            type="button"
            onClick={() => onNavigate('login')}
            className="text-indigo-400 hover:underline hover:text-indigo-300 transition-colors font-bold cursor-pointer"
          >
            {t('Sign in as Demo User Instantly')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
