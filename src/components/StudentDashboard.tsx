import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Clock, 
  Send, 
  GraduationCap, 
  MessageSquare, 
  Award, 
  Calendar, 
  Bell, 
  ArrowUpRight,
  Sparkles,
  Info,
  Check,
  X
} from 'lucide-react';
import { Course, ExamResult, ExamSchedule } from '../types';
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

interface StudentDashboardProps {
  studentName: string;
  publishedQuizzes: Array<{
    id: string;
    title: string;
    subject: string;
    questionsCount: number;
    questions: Array<{
      id: number;
      text: string;
      options: string[];
      correctAnswer: string;
    }>;
  }>;
  currentPath?: string;
  onLogout: () => void;
  onHome: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentName,
  publishedQuizzes,
  currentPath,
  onLogout,
  onHome
}) => {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<ExamSchedule[]>([]);
  const [activeTab, setActiveTab] = useState<'schedule' | 'grades' | 'results' | 'attendance' | 'quizzes'>('schedule');

  useEffect(() => {
    if (currentPath) {
      if (currentPath.includes('/grades') || currentPath.includes('/assessments')) setActiveTab('grades');
      else if (currentPath.includes('/results')) setActiveTab('results');
      else if (currentPath.includes('/attendance')) setActiveTab('attendance');
      else if (currentPath.includes('/quizzes') || currentPath.includes('/tasks')) setActiveTab('quizzes');
      else setActiveTab('schedule');
    }
  }, [currentPath]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getStudentDashboard();
        setCourses(data.courses || []);
        setExams(data.exams || []);
        setUpcomingExams(data.upcomingExams || []);
      } catch (err) {
        console.error("Failed to load student data", err);
      }
    };
    fetchData();
  }, []);
  
  // Quiz taking states
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});
  const [quizScoreResult, setQuizScoreResult] = useState<{ score: number; total: number } | null>(null);
  
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
  
  // Chat simulator state
  const [selectedTeacher, setSelectedTeacher] = useState('Prof. Alistair Miller');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'teacher', text: string, time: string }>>([
    { sender: 'teacher', text: 'Hello Marcus, received your assessment draft! RotationKinematics are flawless. Do you have any questions on the electromagnetism formulas before the finals?', time: '09:30 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTeacherTyping, setIsTeacherTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = { sender: 'user' as const, text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    const typedText = newMessage;
    setNewMessage('');
    setIsTeacherTyping(true);

    // Simulate teacher automated feedback matching the course context
    setTimeout(() => {
      let reply = "Good question, Marcus. I have logged that in our planner. Let's focus on electromagnetic induction chapters in our review session tomorrow.";
      if (typedText.toLowerCase().includes('calculus') || typedText.toLowerCase().includes('integration')) {
        reply = "For integration constants, make sure you double-check bounds. Sarah Jenkins is hosting a calculus BC review session this Friday at 4:30 PM!";
      } else if (typedText.toLowerCase().includes('physics') || typedText.toLowerCase().includes('rotational')) {
        reply = "Rotation kinematics require calculating the vector moment of inertia first. Keep practicing assessment sheet 4B.";
      }
      
      setChatMessages(prev => [...prev, {
        sender: 'teacher',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTeacherTyping(false);
    }, 2000);
  };

  // Helper function to resolve dynamic color themes
  const getProgressColor = (percent: number) => {
    if (percent >= 85) return 'stroke-emerald-400';
    if (percent >= 70) return 'stroke-indigo-400';
    return 'stroke-amber-400';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Navigation Headers */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-sans font-bold text-base text-white tracking-tight">EduManage Student</span>
              <span className="text-[10px] block text-slate-500 font-semibold uppercase">{t('Academic Portal')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-200 block">{studentName}</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono">Enrolled • 11th Grade</span>
              </div>
              <LanguageSelector />
              <button 
                onClick={onHome}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-semibold rounded-lg transition overflow-hidden cursor-pointer"
              >
                {t('Home')}
              </button>
              <button 
                onClick={onLogout}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-semibold rounded-lg transition overflow-hidden cursor-pointer"
              >
                {t('Sign Out')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8 relative z-10">
        
        {/* Customized Student Welcome banner */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <Sparkles className="h-48 w-48 text-emerald-400 translate-x-12 translate-y-12" />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Dashboard Greeting</span>
            <h2 className="text-2xl font-bold text-white">{t('Welcome back')}, {studentName.split(' ')[0]}!</h2>
            <p className="text-slate-400 text-xs max-w-xl">Track your curriculum progress metrics, check scheduled midterm locations, or chat with assigned tutor personnel in real-time.</p>
          </div>
          
          <div className="flex items-center gap-4 shrink-0 relative z-10">
            <div className="bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-lg font-extrabold text-white block">
                <AnimatedCounter value={3.8} decimals={1} />
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase block">{t('GPA Trend')}</span>
            </div>
            <div className="bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-lg font-extrabold text-white block">
                <AnimatedCounter value={98} suffix="%" />
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase block">{t('Attendance')}</span>
            </div>
          </div>
        </div>

        {/* Course Status Progress Widgets & Dynamic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between hover:border-slate-700 transition-all hover:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.15)] cursor-pointer"
            >
              <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block bg-indigo-500/10 w-max px-2 py-0.5 rounded">
                  {course.iconType}
                </span>
                <h4 className="text-sm font-bold text-white truncate">{course.name}</h4>
                <p className="text-xs text-slate-500 truncate">{course.tutorName} • {course.room || 'Seminar Space'}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span className="font-semibold">{course.schedule}</span>
                </div>
              </div>

              {/* Radial donut indicator representing program completions */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="26" fill="transparent" stroke="#1e293b" strokeWidth="4" />
                  <motion.circle cx="32" cy="32" r="26" fill="transparent" strokeWidth="4"
                          className={`transition-all duration-1000 ${getProgressColor(course.progress)}`}
                          initial={{ strokeDashoffset: 163 }}
                          animate={{ strokeDashoffset: 163 - (163 * course.progress) / 100 }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 }}
                          strokeDasharray="163"
                          strokeLinecap="round" />
                </svg>
                <span className="absolute font-mono text-[11px] font-extrabold text-slate-300">
                  <AnimatedCounter value={course.progress} />%
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Workspace splitting: Schedules / Grades left, message simulator right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Calendar & Results toggle board */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-4">
                <div className="flex gap-2 flex-wrap">
                  <button 
                    onClick={() => setActiveTab('schedule')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'schedule' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {t('Exams Timeline')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('grades')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'grades' ? 'bg-indigo-600 text-white' : 'text-slate-450 hover:text-slate-300'}`}
                  >
                    {t('Assessments Log')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('results')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'results' ? 'bg-indigo-600 text-white' : 'text-slate-450 hover:text-slate-300'}`}
                  >
                    {t('Term Results')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('attendance')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'attendance' ? 'bg-indigo-600 text-white' : 'text-slate-450 hover:text-slate-300'}`}
                  >
                    {t('Attendance Calendar')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('quizzes')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'quizzes' ? 'bg-indigo-600 text-white' : 'text-slate-450 hover:text-slate-300'}`}
                  >
                    {t('Subject Quizzes')}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold bg-slate-950 px-2.5 py-1 rounded-lg">
                  <Calendar className="h-3.5 w-3.5" /> Upcoming
                </div>
              </div>

              {/* Sub-panels display */}
              <AnimatePresence mode="wait">
                {activeTab === 'schedule' ? (
                  <motion.div 
                    key="timeline"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-3"
                  >
                    {upcomingExams.map((exam) => (
                      <div key={exam.id} className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 transition rounded-2xl flex items-center justify-between">
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold block w-max mb-1.5 ${exam.type === 'Midterm' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-teal-500/10 text-teal-400'}`}>
                            {exam.type} Assessment
                          </span>
                          <h5 className="text-sm font-bold text-white mb-0.5">{exam.name}</h5>
                          <span className="text-xs text-slate-500">{exam.location}</span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-extrabold text-indigo-400 block">{exam.date}</span>
                          <span className="text-[10px] text-slate-500 font-bold block">{exam.time}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : activeTab === 'grades' ? (
                  <motion.div 
                    key="grades"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-3.5"
                  >
                    {exams.map((assessment) => (
                      <div key={assessment.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-xs font-bold text-white truncate max-w-xs">{assessment.examName}</h5>
                          <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {assessment.score} / {assessment.maxScore}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal mb-1">
                          <strong className="text-slate-500">Instructor Notes:</strong> "{assessment.teacherNotes}"
                        </p>
                        <span className="text-[9px] text-slate-500 font-semibold">Compiled on {assessment.date}</span>
                      </div>
                    ))}
                  </motion.div>
                ) : activeTab === 'attendance' ? (
                  <motion.div
                    key="attendance"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-3.5"
                  >
                    <div className="p-6 bg-slate-950 border border-slate-850 rounded-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        
                        {/* Calendar Left */}
                        <div className="w-full max-w-xs mx-auto md:mx-0">
                          <div className="flex flex-col items-center mb-4 gap-2">
                            <span className="text-xs font-bold text-white">May 2026</span>
                            <div className="flex gap-3 text-[9px] font-semibold text-slate-400">
                              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Present</span>
                              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Absent</span>
                              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-700" /> Weekend</span>
                            </div>
                          </div>

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
                                <AnimatedCounter value={90.5} decimals={1} />%
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-white block">Attendance Percentage</span>
                              <p className="text-[10px] text-slate-400 leading-snug">Attended 19 out of 21 sessions. Maintain 90%+ attendance to qualify for term exams.</p>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                ) : activeTab === 'quizzes' ? (
                  <motion.div
                    key="quizzes"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl">
                      <div className="border-b border-slate-850 pb-3 mb-4 flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider">{t('Assigned Topic Quizzes')}</h5>
                          <span className="text-[10px] text-slate-500">Test your conceptual knowledge in registered courses</span>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">Active Evaluation</span>
                      </div>

                      <div className="space-y-3">
                        {publishedQuizzes.map((quiz) => (
                          <div key={quiz.id} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded w-max block">
                                {quiz.subject}
                              </span>
                              <h6 className="text-sm font-bold text-white">{quiz.title}</h6>
                              <span className="text-[10px] text-slate-500 block">Total Questions: {quiz.questions.length} • Format: MCQ</span>
                            </div>
                            <button
                              onClick={() => {
                                setActiveQuizId(quiz.id);
                                setStudentAnswers({});
                                setQuizScoreResult(null);
                              }}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                            >
                              Start Quiz
                            </button>
                          </div>
                        ))}
                        {publishedQuizzes.length === 0 && (
                          <div className="text-center py-8 text-xs text-slate-550 italic">
                            No quizzes have been published by the instructor yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-3.5"
                  >
                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col items-center justify-center py-8">
                      <Award className="h-12 w-12 text-indigo-400 mb-3 opacity-50" />
                      <h5 className="text-sm font-bold text-white mb-1">Final Term Results Published</h5>
                      <p className="text-xs text-slate-500 max-w-sm text-center">Your final grades for this semester have been compiled. Download the full PDF report below.</p>
                      <button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5">
                        Download Report
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500">
              <span>Looking for homework templates?</span>
              <a href="#materials" className="text-indigo-400 hover:underline flex items-center gap-1 font-bold">
                Access PDF Materials <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Teacher Message Chatbox Simulator CRM Integration */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between h-[420px]">
            <div className="border-b border-slate-850 pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="h-4.5 w-4.5 text-emerald-400" /> {t('Messaging Station')}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              </div>
              
              {/* Teacher Selector dropdown */}
              <select
                value={selectedTeacher}
                onChange={(e) => {
                  setSelectedTeacher(e.target.value);
                  setChatMessages([
                    { sender: 'teacher', text: `Hi Marcus, this is ${e.target.value}. Ask me anything about current class curriculums or upcoming evaluations.`, time: '10:00 AM' }
                  ]);
                }}
                className="bg-slate-950 border border-slate-850 text-[10px] text-slate-300 font-bold p-1 px-2 rounded-lg outline-none"
              >
                <option>Prof. Alistair Miller</option>
                <option>Sarah Jenkins</option>
                <option>Dr. Evelyn Sterling</option>
              </select>
            </div>

            {/* Chats messages box */}
            <div className="flex-1 overflow-y-auto space-y-3 my-4 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-950 text-slate-300 rounded-tl-none border border-slate-850'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 font-mono pr-1">{msg.time}</span>
                </div>
              ))}

              {isTeacherTyping && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-slate-950/40 p-2 rounded-xl border border-slate-850/40 w-max">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span>Tutor compiling notes...</span>
                </div>
              )}
            </div>

            {/* Controls input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about 'Physics Final' or 'CalculusBC'..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl flex-1 outline-none focus:border-indigo-500 text-slate-200"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className={`p-2.5 rounded-xl transition shrink-0 cursor-pointer flex items-center justify-center ${
                  newMessage.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Resources Cards section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6" id="materials">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">{t('Student Hub Academic Resources')}</h3>
            <span className="text-[11px] text-slate-500">Curated materials matching active course registration tracks</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 hover:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.15)] transition rounded-2xl flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-white block">Physics Mechanics 4B</span>
                <span className="text-[10px] text-slate-500">PDF Study Syllabus</span>
              </div>
              <Award className="h-5 w-5 text-indigo-400 shrink-0" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 hover:shadow-[0_10px_20px_-10px_rgba(20,184,166,0.15)] transition rounded-2xl flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-white block">Integration Vectors Assessment</span>
                <span className="text-[10px] text-slate-500">Practice Exam Questions</span>
              </div>
              <Award className="h-5 w-5 text-teal-400 shrink-0" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 hover:shadow-[0_10px_20px_-10px_rgba(245,158,11,0.15)] transition rounded-2xl flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-white block">Lab safety index Honors</span>
                <span className="text-[10px] text-slate-500">Lab Assessment Criteria</span>
              </div>
              <Award className="h-5 w-5 text-amber-400 shrink-0" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-4 bg-slate-950 border border-emerald-500/30 bg-emerald-500/5 hover:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.15)] transition rounded-2xl flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-emerald-400 block">Summer Prep Course Book</span>
                <span className="text-[10px] text-slate-400">Bonus Academic Guide</span>
              </div>
              <Award className="h-5 w-5 text-emerald-400 shrink-0 animate-pulse" />
            </motion.div>
          </div>
        </div>

      </main>

      {/* Quiz Modal */}
      <AnimatePresence>
        {activeQuizId && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setActiveQuizId(null)}
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-[90vh] sm:h-max sm:max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-50 p-6 text-slate-100 flex flex-col justify-between overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-slate-850 pb-4 shrink-0">
                <div>
                  <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-wider block w-max">
                    {publishedQuizzes.find(q => q.id === activeQuizId)?.subject}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {publishedQuizzes.find(q => q.id === activeQuizId)?.title}
                  </h4>
                </div>
                <button 
                  onClick={() => setActiveQuizId(null)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Questions Content */}
              <div className="flex-1 overflow-y-auto my-6 pr-1 space-y-6">
                {quizScoreResult ? (
                  /* Quiz score result */
                  <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="transparent" stroke="#1e293b" strokeWidth="6" />
                        <circle cx="48" cy="48" r="40" fill="transparent" strokeWidth="6"
                                className="stroke-indigo-500 transition-all duration-1000"
                                strokeDasharray="251" strokeDashoffset={251 - (251 * (quizScoreResult.score / quizScoreResult.total))}
                                strokeLinecap="round" />
                      </svg>
                      <span className="absolute font-mono text-lg font-extrabold text-white">
                        {Math.round((quizScoreResult.score / quizScoreResult.total) * 100)}%
                      </span>
                    </div>

                    <div className="text-center space-y-1">
                      <h5 className="text-base font-bold text-white">Evaluation Complete</h5>
                      <p className="text-xs text-slate-400">
                        You scored <strong className="text-indigo-400">{quizScoreResult.score}</strong> out of <strong className="text-slate-350">{quizScoreResult.total}</strong> questions correctly.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveQuizId(null)}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Close Evaluation Board
                    </button>
                  </div>
                ) : (
                  /* Render list of questions to answer */
                  publishedQuizzes.find(q => q.id === activeQuizId)?.questions.map((question, idx) => (
                    <div key={question.id} className="space-y-3">
                      <h5 className="text-xs font-bold text-slate-200">
                        {idx + 1}. {question.text}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {question.options.map((opt, oIdx) => {
                          const optionLetter = ['A', 'B', 'C', 'D'][oIdx];
                          const isSelected = studentAnswers[question.id] === optionLetter;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => {
                                setStudentAnswers(prev => ({ ...prev, [question.id]: optionLetter }));
                              }}
                              className={`p-3 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50 shadow-md shadow-indigo-500/5'
                                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300 hover:border-slate-750'
                              }`}
                            >
                              <span>{optionLetter}. {opt}</span>
                              {isSelected && <Check className="h-4 w-4 text-indigo-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {!quizScoreResult && (
                <div className="border-t border-slate-850 pt-4 flex justify-between items-center shrink-0">
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Ensure all questions are completed before submitting.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const quiz = publishedQuizzes.find(q => q.id === activeQuizId);
                      if (!quiz) return;
                      let correctCount = 0;
                      quiz.questions.forEach(q => {
                        if (studentAnswers[q.id] === q.correctAnswer) {
                          correctCount++;
                        }
                      });
                      setQuizScoreResult({ score: correctCount, total: quiz.questions.length });
                    }}
                    disabled={
                      Object.keys(studentAnswers).length < 
                      (publishedQuizzes.find(q => q.id === activeQuizId)?.questions.length || 0)
                    }
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                      Object.keys(studentAnswers).length === 
                      (publishedQuizzes.find(q => q.id === activeQuizId)?.questions.length || 0)
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Submit & Evaluate <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
