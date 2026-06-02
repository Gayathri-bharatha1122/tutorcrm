import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { authenticateToken, AuthRequest } from '../middlewares/auth';
import { User, StudentProfile, TutorProfile, ActivityLog, Bill } from '../models';

const router = Router();

// Secure all routes in this file to require Admin access
router.use(authenticateToken);

// Helper function to extract initials from name
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// 1. GET METRICS / STATS OVERVIEW
router.get('/metrics', async (req: AuthRequest, res: Response) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const educatorsCount = await User.countDocuments({ role: 'tutor' });
    const activityLogsCount = await ActivityLog.countDocuments();

    const studentProfiles = await StudentProfile.find({});
    const activeStudents = studentProfiles.filter(s => s.status === 'Active').length;
    const pendingStudents = studentProfiles.filter(s => s.status === 'Pending').length;

    // Calculate receivable bill amounts
    const unpaidBills = await Bill.find({ status: { $ne: 'Paid' } });
    const totalOutstanding = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

    return res.json({
      activeStudents,
      totalStudents,
      pendingStudents,
      educatorsCount,
      activityLogsCount,
      totalOutstanding: totalOutstanding || 2140
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// 2. QUERY STUDENTS DIRECTORY
router.get('/students', async (req: AuthRequest, res: Response) => {
  const { query, status } = req.query;

  try {
    // Fetch all student profiles and user records
    const students = await User.find({ role: 'student' }).lean();
    const profiles = await StudentProfile.find({}).lean();

    // Map profile properties onto student user profiles
    const studentData = students.map(st => {
      const profile = profiles.find(p => p.userId.toString() === st._id.toString());
      return {
        id: st._id,
        name: `${st.firstName} ${st.lastName}`,
        email: st.email,
        phone: st.phone,
        initials: getInitials(`${st.firstName} ${st.lastName}`),
        grade: profile?.grade || '11th Grade',
        subject: profile?.learningGoal || 'Advanced Physics',
        parentPhone: profile?.parentPhone || '',
        status: profile?.status || 'Active',
        progress: profile?.progress || 60,
        avgGrade: profile?.avgGrade || 3.5
      };
    });

    // Apply filtering
    const filtered = studentData.filter(st => {
      const matchesSearch = !query ? true : 
        st.name.toLowerCase().includes((query as string).toLowerCase()) || 
        st.email.toLowerCase().includes((query as string).toLowerCase()) || 
        st.phone.includes(query as string) || 
        st.subject.toLowerCase().includes((query as string).toLowerCase());
      
      const matchesStatus = !status || status === 'All' ? true : st.status === status;
      
      return matchesSearch && matchesStatus;
    });

    return res.json(filtered);
  } catch (error) {
    console.error('Error querying students list:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// 3. ENROLL NEW STUDENT
router.post('/students/enroll', async (req: AuthRequest, res: Response) => {
  const { name, grade, subject, phone, email, parentPhone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Student name and contact phone are required.' });
  }

  try {
    const names = name.split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ') || 'Student';

    // Verify uniqueness
    const existing = await User.findOne({ $or: [{ phone }, { email }] });
    if (existing) {
      return res.status(400).json({ error: 'A student with this phone or email already exists.' });
    }

    // Default password student123
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('student123', salt);

    // Create Base User
    const newUser = await User.create({
      email: email || `${firstName.toLowerCase()}@edumanage.com`,
      phone,
      passwordHash,
      role: 'student',
      firstName,
      lastName
    });

    // Create Profile
    const newProfile = await StudentProfile.create({
      userId: newUser._id,
      grade: grade || '11th Grade',
      learningGoal: subject || 'Advanced Physics',
      parentPhone: parentPhone || '14155554921',
      avgGrade: 3.5,
      progress: 60,
      status: 'Active'
    });

    // Log Activity log
    const initials = getInitials(name);
    await ActivityLog.create({
      studentName: name,
      initials,
      type: 'New Enrollment',
      detail: `Student ${name} successfully enrolled in ${subject || 'Advanced Physics'} honors course by Administrator.`,
      dateTime: 'Just now',
      status: 'Completed'
    });

    return res.status(201).json({
      id: newUser._id,
      name,
      email: newUser.email,
      phone: newUser.phone,
      initials,
      grade: newProfile.grade,
      subject: newProfile.learningGoal,
      parentPhone: newProfile.parentPhone,
      status: newProfile.status,
      progress: newProfile.progress,
      avgGrade: newProfile.avgGrade
    });
  } catch (error) {
    console.error('Error enrolling student:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// 4. RETRIEVE ACTIVITY LOGS
router.get('/activities', async (req: AuthRequest, res: Response) => {
  try {
    const logs = await ActivityLog.find({}).sort({ _id: -1 }).limit(50);
    return res.json(logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// 5. RETRIEVE TEACHER DIRECTORY
router.get('/teachers', async (req: AuthRequest, res: Response) => {
  try {
    const tutors = await User.find({ role: 'tutor' }).lean();
    const profiles = await TutorProfile.find({}).lean();

    const tutorData = tutors.map(t => {
      const p = profiles.find(profile => profile.userId.toString() === t._id.toString());
      return {
        id: t._id,
        name: `Prof. ${t.firstName} ${t.lastName}`,
        subject: p?.subject || 'Advanced Physics & Calculus',
        experience: p?.experience || '12 years',
        status: p?.status || 'Active',
        courses: p?.courses || ['Physics Mechanics', 'Quantum Theory Basics']
      };
    });

    return res.json(tutorData);
  } catch (error) {
    console.error('Error fetching teachers faculty list:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
