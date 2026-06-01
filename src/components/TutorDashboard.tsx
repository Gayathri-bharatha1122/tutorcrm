import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  Award, 
  Clock, 
  Plus, 
  Sparkles, 
  Check, 
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Info,
  X
} from 'lucide-react';
import { Student, Teacher } from '../types';
import { useLanguage } from '../LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface TutorDashboardProps {
  students: Student[];
  teachers: Teacher[];
  tutorName: string;
  onLogout: () => void;
  onHome: () => void;
}

export const TutorDashboard: React.FC<TutorDashboardProps> = ({
  students,
  teachers,
  tutorName,
  onLogout,
  onHome
}) => {
  const { t } = useLanguage();
  const [markedAttendance, setMarkedAttendance] = useState<Record<string, 'Present' | 'Absent' | 'Excused'>>({
    ST001: 'Present',
    ST002: 'Present',
    ST003: 'Present'
  });
  
  // Custom grading states
  const [selectedStudentId, setSelectedStudentId] = useState('ST001');
  const [assignmentName, setAssignmentName] = useState('Rotational Force Vector Essays');
  const [gradeScore, setGradeScore] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState('Fabulous conceptual formulation of inertia variables! Continue high fidelity research.');
  const [isGradingCompiled, setIsGradingCompiled] = useState(false);
  const [assignedSuccessMsg, setAssignedSuccessMsg] = useState<string | null>(null);

  // Scheduling states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [lectureTitle, setLectureTitle] = useState('Quantum Dynamics Core vectors');
  const [lectureDate, setLectureDate] = useState('June 10, 2026');
  const [lectureTime, setLectureTime] = useState('03:00 PM');
  const [lectureLocation, setLectureLocation] = useState('Studio Hall 3');

  // Handle student attendance updates
  const handleAttendanceChange = (studentId: string, status: 'Present' | 'Absent' | 'Excused') => {
    setMarkedAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleGradeAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    setIsGradingCompiled(true);
    setTimeout(() => {
      setIsGradingCompiled(false);
      setAssignedSuccessMsg(`Successfully logged assignment score of ${gradeScore}% for "${student.name}". Progress metrics updated.`);
      setTimeout(() => setAssignedSuccessMsg(null), 4000);
    }, 1500);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowScheduleModal(false);
    setAssignedSuccessMsg(`Scheduled lectures on "${lectureTitle}" hosted on ${lectureDate} at ${lectureTime} successfully.`);
    setTimeout(() => setAssignedSuccessMsg(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Navigation Headers */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center animate-spin [animation-duration:10s]">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-sans font-bold text-base text-white tracking-tight">EduManage Tutor</span>
              <span className="text-[10px] block text-slate-500 font-semibold uppercase">{t('Academic Command')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-200 block">{tutorName}</span>
                <span className="text-[10px] text-teal-400 font-bold uppercase font-mono">Senior Instructor Faculty</span>
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

      {/* Main Containers */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8 relative z-10">
        
        {/* Dynamic Success alerts */}
        <AnimatePresence>
          {assignedSuccessMsg && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="bg-teal-600 border border-teal-500/30 rounded-2xl p-4 text-white text-xs font-bold flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>{assignedSuccessMsg}</span>
              </div>
              <button onClick={() => setAssignedSuccessMsg(null)}>
                <X className="h-4 w-4 text-teal-200 hover:text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Highlight Stats summaries and classroom scheduling hooks */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Senior Instructor Control</span>
            <h2 className="text-2xl font-bold text-white">{t('Daily Command Space')} – {tutorName}</h2>
            <p className="text-slate-400 text-xs">Manage active pupil attendances, input assignment metrics, and dispatch calendar coordinates.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-teal-600/15 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> {t('Schedule seminar session')}
            </button>
          </div>
        </div>

        {/* Interactive Attendance checklist and Assigment grading tools splitting */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Daily classroom checklist - Left */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-850 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{t('Mark Today\'s Classroom Attendance Roll')}</h3>
                  <span className="text-[10px] text-slate-500">Record classroom absences instantly for automatic parent sync</span>
                </div>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded">Daily Standard Journal</span>
              </div>

              <div className="divide-y divide-slate-850">
                {students.slice(0, 4).map((student) => (
                  <div key={student.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-950/20 px-2.5 transition rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center font-bold text-teal-400">
                        {student.name[0]}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{student.name}</span>
                        <span className="text-[10px] text-slate-500 block">{student.grade} • Registered in Advanced physics</span>
                      </div>
                    </div>

                    {/* Attendance status togglers */}
                    <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-lg text-[10px] font-bold">
                      {(['Present', 'Absent', 'Excused'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleAttendanceChange(student.id, status)}
                          className={`px-2.5 py-1 rounded-md cursor-pointer transition ${
                            markedAttendance[student.id] === status 
                              ? 'bg-teal-600 text-white' 
                              : 'text-slate-500 hover:text-slate-350'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-5 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500">
              <span>Automatic notification dispatched to parents upon attendance submissions.</span>
              <span className="text-teal-400 hover:underline cursor-pointer font-bold flex items-center gap-0.5">
                Review Historical Attendance Ledger <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>

          {/* Assignment grader panel - Right */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest text-teal-400 mb-1">{t('Evaluate Assignment Draft')}</h3>
              <h4 className="text-sm font-bold text-white">Record Curricular Grades and Feedback</h4>
            </div>

            <form onSubmit={handleGradeAssignmentSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Student Profile *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-300"
                >
                  {students.slice(0, 4).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assignment Description *</label>
                <input
                  type="text"
                  required
                  value={assignmentName}
                  onChange={(e) => setAssignmentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200"
                  placeholder="Rotational Force kinematic Essays"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Assessment Score *</label>
                  <span className="text-xs font-bold text-teal-400 font-mono">{gradeScore}% (Grade A)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full accent-teal-500 h-1 bg-slate-950 rounded-lg outline-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Feedback Notation / Teacher Comments</label>
                <textarea
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-200 text-xs p-3 rounded-xl focus:border-teal-500 outline-none transition resize-none"
                  placeholder="Record pedagogical instructions..."
                />
              </div>

              {isGradingCompiled ? (
                <div className="p-3 bg-teal-950/20 border border-teal-500/20 text-teal-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  <span>Logging score metrics to campus registry...</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-lg shadow-teal-600/10 transition flex items-center justify-center gap-1.5"
                >
                  {t('Compile & Log Evaluation')} <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

        </div>

        {/* Timetables lectures preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">{t('Lecture Timetable')}</h3>
            <span className="text-[11px] text-slate-550 block">Assigned academic slots for active physics curricula</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 transition rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Kinematic Vectors theory</span>
                <span className="text-[10px] text-slate-500">Tuesdays at 3:00 PM • Room B1</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 transition rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Quantum mechanics fundamentals</span>
                <span className="text-[10px] text-slate-500">Thursdays at 3:00 PM • Lab Hall 1</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-teal-500/30 bg-teal-500/5 transition rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="h-5 w-5 animate-spin [animation-duration:8s]" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-400 block">General electromagnetic finals prep</span>
                <span className="text-[10px] text-slate-400">Fridays at 2:30 PM • Seminar Studio</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Classroom scheduling modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowScheduleModal(false)}
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto w-full max-w-sm h-max bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-50 p-6 text-slate-100"
            >
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Calendar className="h-4.5 w-4.5 text-teal-400 animate-pulse" /> Schedule Lecture Slot
                  </h4>
                  <span className="text-[11px] text-slate-550">Insert academic calendar slots</span>
                </div>
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lecture Topic / Title *</label>
                  <input
                    type="text"
                    required
                    value={lectureTitle}
                    onChange={(e) => setLectureTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lecture Held Date *</label>
                  <input
                    type="text"
                    required
                    value={lectureDate}
                    onChange={(e) => setLectureDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Start Time *</label>
                    <input
                      type="text"
                      required
                      value={lectureTime}
                      onChange={(e) => setLectureTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Seminar Hall *</label>
                    <input
                      type="text"
                      required
                      value={lectureLocation}
                      onChange={(e) => setLectureLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200 text-center"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5"
                >
                  Confirm Scheduling <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
