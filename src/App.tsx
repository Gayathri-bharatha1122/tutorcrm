import { useState, useEffect } from 'react';
import { api } from './services/api';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageProvider } from './LanguageContext';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('edumanage_token');
    if (token) {
      api.getCurrentUser().then(data => {
        const user = data.user || data;
        setActiveRole(user.role);
        setCurrentProfileName(user.name || user.firstName);
        setIsLoggedIn(true);
        if (user.role === 'admin') setScreen('admin');
        else if (user.role === 'tutor') setScreen('tutor');
        else if (user.role === 'parent') setScreen('parent');
        else setScreen('student');
      }).catch(() => {
        localStorage.removeItem('edumanage_token');
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Persistence States synced with LocalStorage

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



  // Route screen selections
  const handleNavigate = (targetScreen: Screen, initialRole?: Role) => {
    setScreen(targetScreen);
    if (initialRole) {
      setActiveRole(initialRole);
    }
  };

  const handleLoginSuccess = (role: Role, name?: string) => {
    setActiveRole(role);
    setIsLoggedIn(true);
    // Resolve personal name tags corresponding to roles for display
    if (role === 'admin') {
      setCurrentProfileName(name || 'System Administrator');
      setScreen('admin');
    } else if (role === 'tutor') {
      setCurrentProfileName(name || 'Prof. Alistair Miller');
      setScreen('tutor');
    } else if (role === 'parent') {
      setCurrentProfileName(name || 'Helena Thorne');
      setScreen('parent');
    } else {
      setCurrentProfileName(name || 'Marcus Thorne');
      setScreen('student');
    }
  };

  const handleRegisteredSuccess = (role: Role, customName: string) => {
    setActiveRole(role);
    setCurrentProfileName(customName);
    setIsLoggedIn(true);
    
    if (role === 'parent') {
      setScreen('parent');
    } else {
      setScreen('student');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('edumanage_token');
    setIsLoggedIn(false);
    setScreen('landing');
  };

  const handleHome = () => {
    setScreen('landing');
  };

  const isPublicPage = ['landing', 'login', 'register'].includes(screen);

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <LanguageProvider>
      <div className="bg-slate-950 min-h-screen w-full overflow-x-hidden text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">

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
                  parentName={currentProfileName}
                  studentName="Marcus Thorne"
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
                  tutorName={currentProfileName}
                  onLogout={handleLogout}
                  onHome={handleHome}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AIChatBox />
      </div>
    </LanguageProvider>
  );
}
