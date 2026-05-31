import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';
import { RegisterStepper } from './components/RegisterStepper';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { TutorDashboard } from './components/TutorDashboard';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [activeRole, setActiveRole] = useState<Role>('student');

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
    setScreen('landing');
  };

  return (
    <div className="bg-slate-950 min-h-screen w-full overflow-x-hidden text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">

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
              <LandingPage onNavigate={handleNavigate} />
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
                onLogout={handleLogout}
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
                onLogout={handleLogout}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
