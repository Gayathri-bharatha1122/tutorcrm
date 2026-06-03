import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageProvider } from './LanguageContext';
import { 
  initialStudents, 
  initialTeachers, 
  initialActivityLogs, 
  marcusCourses, 
  marcusExams, 
  upcomingExams, 
  helenaBills, 
  systemAnnouncements 
} from './data';
import { Student, Teacher, ActivityLog, Course, Bill, Announcement, Screen, Role } from './types';

// Importing Views
import { PublicNavbar } from './components/PublicNavbar';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';
import { RegisterStepper } from './components/RegisterStepper';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { TutorDashboard } from './components/TutorDashboard';
import { AIChatBox } from './components/AIChatBox';


export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [activeRole, setActiveRole] = useState<Role>('student');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Global Scroll Parallax State
  const [globalScrollY, setGlobalScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setGlobalScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Persistence States synced with LocalStorage
  const [studentsList, setStudentsList] = useState<Student[]>(() => {
    const cached = localStorage.getItem('edumanage_students');
    return cached ? JSON.parse(cached) : initialStudents;
  });

  const [teachersList] = useState<Teacher[]>(initialTeachers);
  
  const [activityLogsList, setActivityLogsList] = useState<ActivityLog[]>(() => {
    const cached = localStorage.getItem('edumanage_activities');
    return cached ? JSON.parse(cached) : initialActivityLogs;
  });

  const [parentBillsList, setParentBillsList] = useState<Bill[]>(() => {
    const cached = localStorage.getItem('edumanage_bills');
    return cached ? JSON.parse(cached) : helenaBills;
  });

  const [publishedQuizzes, setPublishedQuizzes] = useState<Array<{
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
  }>>(() => {
    const cached = localStorage.getItem('edumanage_quizzes');
    return cached ? JSON.parse(cached) : [
      {
        id: 'q1',
        title: 'Electromagnetic Fields Intro',
        subject: 'Electromagnetism',
        questionsCount: 1,
        questions: [
          {
            id: 1,
            text: 'What is the SI unit of magnetic flux density?',
            options: ['Tesla', 'Weber', 'Henry', 'Farad'],
            correctAnswer: 'A'
          }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('edumanage_quizzes', JSON.stringify(publishedQuizzes));
  }, [publishedQuizzes]);

  const handlePublishQuiz = (newQuiz: { title: string; subject: string; questions: any[] }) => {
    setPublishedQuizzes(prev => [
      { id: `q-${Date.now()}`, ...newQuiz, questionsCount: newQuiz.questions.length },
      ...prev
    ]);
  };

  // Cached profile identity
  const [currentProfileName, setCurrentProfileName] = useState<string>('Marcus Thorne');

  useEffect(() => {
    localStorage.setItem('edumanage_students', JSON.stringify(studentsList));
  }, [studentsList]);

  useEffect(() => {
    localStorage.setItem('edumanage_activities', JSON.stringify(activityLogsList));
  }, [activityLogsList]);

  useEffect(() => {
    localStorage.setItem('edumanage_bills', JSON.stringify(parentBillsList));
  }, [parentBillsList]);

  // Handle Enrollment additions
  const handleAddNewStudent = (newStudent: Omit<Student, 'id' | 'avgGrade' | 'progress' | 'initials'>) => {
    const studentId = `ST00${studentsList.length + 1}`;
    const initials = newStudent.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const studentObj: Student = {
      ...newStudent,
      id: studentId,
      initials,
      progress: 60, // starting checklist status
      avgGrade: 3.5
    };

    setStudentsList(prev => [studentObj, ...prev]);

    // Commit to activity log registry
    const logItem: ActivityLog = {
      id: `ACT00${activityLogsList.length + 1}`,
      studentName: newStudent.name,
      initials,
      type: 'New Enrollment',
      detail: `Student ${newStudent.name} successfully enrolled in ${newStudent.subject} honors course by Administrator.`,
      dateTime: 'Just now',
      status: 'Completed'
    };

    setActivityLogsList(prev => [logItem, ...prev]);
  };

  // Route screen selections
  const handleNavigate = (targetScreen: Screen, initialRole?: Role) => {
    setScreen(targetScreen);
    if (initialRole) {
      setActiveRole(initialRole);
    }
  };

  const handleLoginSuccess = (role: Role) => {
    setActiveRole(role);
    setIsLoggedIn(true);
    // Resolve personal name tags corresponding to roles for display
    if (role === 'admin') {
      setCurrentProfileName('System Administrator');
      setScreen('admin');
    } else if (role === 'tutor') {
      setCurrentProfileName('Prof. Alistair Miller');
      setScreen('tutor');
    } else if (role === 'parent') {
      setCurrentProfileName('Helena Thorne');
      setScreen('parent');
    } else {
      setCurrentProfileName('Marcus Thorne');
      setScreen('student');
    }
  };

  const handleRegisteredSuccess = (role: Role, customName: string) => {
    setActiveRole(role);
    setCurrentProfileName(customName);
    setIsLoggedIn(true);
    
    // Auto insert child student if register as parent
    if (role === 'parent') {
      setScreen('parent');
    } else {
      // Register new student to database list
      handleAddNewStudent({
        name: customName,
        grade: '11th Grade',
        subject: 'Advanced Physics',
        phone: '14155550000',
        email: `${customName.toLowerCase().replace(' ', '.')}@edumail.com`,
        parentPhone: '14155554921',
        status: 'Active'
      });
      setScreen('student');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setScreen('landing');
  };

  const handleHome = () => {
    setScreen('landing');
  };

  const isPublicPage = ['landing', 'login', 'register'].includes(screen);

  return (
    <LanguageProvider>
      <div className="bg-slate-950 min-h-screen w-full overflow-x-hidden text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative">

        {/* Global Mesh Gradient Background */}
        <div 
          className="fixed inset-0 mesh-gradient-bg pointer-events-none z-0" 
          style={{ transform: `translateY(${globalScrollY * 0.05}px)` }}
        />
        
        {/* Global Floating Particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(15)].map((_, i) => {
            const size = (i % 3 + 1) * 6; // 6px, 12px, 18px
            const left = `${(i * 7) % 100}%`;
            const delay = `${(i * 1.2) % 12}s`;
            const duration = `${15 + (i * 4) % 20}s`;
            const color = i % 3 === 0 ? 'bg-indigo-400/10' : i % 3 === 1 ? 'bg-indigo-600/8' : 'bg-emerald-500/10';
            return (
              <div
                key={i}
                className={`absolute rounded-full blur-[2px] ${color}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: left,
                  bottom: '-50px',
                  animation: `particle-float ${duration} infinite linear`,
                  animationDelay: delay,
                }}
              />
            );
          })}
        </div>

        {/* Global Content Wrapper */}
        <div className="relative z-10 flex-1 flex flex-col justify-between w-full">
          {isPublicPage && <PublicNavbar screen={screen} onNavigate={handleNavigate} isLoggedIn={isLoggedIn} activeRole={activeRole} />}

          {/* Route Render Engine with AnimatePresence */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {screen === 'landing' && (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <LandingPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} activeRole={activeRole} />
                </motion.div>
              )}

              {screen === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full"
                >
                  <LoginScreen 
                    onLoginSuccess={handleLoginSuccess} 
                    onNavigate={handleNavigate} 
                    initialRole={activeRole} 
                  />
                </motion.div>
              )}

              {screen === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <RegisterStepper 
                    onNavigate={handleNavigate} 
                    onRegisteredSuccess={handleRegisteredSuccess} 
                  />
                </motion.div>
              )}

              {screen === 'admin' && (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full animate-fade-in"
                >
                  <AdminDashboard 
                    students={studentsList}
                    teachers={teachersList}
                    activityLogs={activityLogsList}
                    onAddStudent={handleAddNewStudent}
                    onLogout={handleLogout}
                    onHome={handleHome}
                  />
                </motion.div>
              )}

              {screen === 'student' && (
                <motion.div
                  key="student"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <StudentDashboard 
                    courses={marcusCourses}
                    exams={marcusExams}
                    upcomingExams={upcomingExams}
                    studentName={currentProfileName}
                    publishedQuizzes={publishedQuizzes}
                    onLogout={handleLogout}
                    onHome={handleHome}
                  />
                </motion.div>
              )}

              {screen === 'parent' && (
                <motion.div
                  key="parent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <ParentDashboard 
                    bills={parentBillsList}
                    announcements={systemAnnouncements}
                    parentName={currentProfileName}
                    studentName="Marcus Thorne"
                    onUpdateBills={setParentBillsList}
                    onLogout={handleLogout}
                    onHome={handleHome}
                  />
                </motion.div>
              )}

              {screen === 'tutor' && (
                <motion.div
                  key="tutor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <TutorDashboard 
                    students={studentsList}
                    teachers={teachersList}
                    tutorName={currentProfileName}
                    publishedQuizzes={publishedQuizzes}
                    onPublishQuiz={handlePublishQuiz}
                    onLogout={handleLogout}
                    onHome={handleHome}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AIChatBox />
        </div>
      </div>
    </LanguageProvider>
  );
}
