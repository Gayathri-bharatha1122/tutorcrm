import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, StudentProfile, IStudentProfile } from '../models';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_tutor_crm_jwt_token_key_123!';

// Mock OTP storage in memory for simplicity (in production use Redis/Database)
const pendingOtps = new Map<string, string>();

// 1. VERIFY STUDENT LINKAGE LOOKUP (For Parent Stepper Step 3)
router.get('/verify-linkage', async (req: Request, res: Response) => {
  const { phone } = req.query;

  if (!phone) {
    return res.status(400).json({ error: 'Student phone number is required.' });
  }

  try {
    const sanitized = (phone as string).replace(/\D/g, '');
    
    // Find a student user that matches this phone
    const studentUser = await User.findOne({ 
      role: 'student', 
      phone: { $regex: sanitized } 
    });

    if (!studentUser) {
      return res.status(404).json({ 
        error: 'No active student found with that register phone ID in the campus database. Try "14155550218" for demonstration!' 
      });
    }

    const studentProfile = await StudentProfile.findOne({ userId: studentUser._id });

    // Generate a simulated OTP (always '6423' for ease of testing as per frontend spec)
    const code = '6423';
    pendingOtps.set(sanitized, code);

    return res.json({
      status: 'OTP_SENT',
      student: {
        id: studentUser._id,
        name: `${studentUser.firstName} ${studentUser.lastName}`,
        grade: studentProfile?.grade || '11th Grade',
        subject: studentProfile?.learningGoal || 'Advanced Physics'
      },
      msg: 'Simulated OTP code sent: 6423'
    });
  } catch (error) {
    console.error('Error during student linkage lookup:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// 2. REGISTER USER (Student or Parent)
router.post('/register', async (req: Request, res: Response) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    password, 
    role, 
    grade, 
    learningGoal, 
    parentPhone, 
    studentPhoneLookup
  } = req.body;

  if (!email || !phone || !password || !role || !firstName || !lastName) {
    return res.status(400).json({ error: 'All primary registry details are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email or phone number already exists.' });
    }



    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create Base User
    const newUser = await User.create({
      email,
      phone,
      passwordHash,
      role,
      firstName,
      lastName
    });

    // Create Profile context if student
    if (role === 'student') {
      await StudentProfile.create({
        userId: newUser._id,
        grade: grade || '11th Grade',
        learningGoal: learningGoal || '',
        parentPhone: parentPhone || '',
        avgGrade: 3.5,
        progress: 60,
        status: 'Active'
      });
    }

    // Sign JWT Token
    const token = jwt.sign(
      { 
        id: newUser._id, 
        email: newUser.email, 
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone
      }, 
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        name: `${newUser.firstName} ${newUser.lastName}`
      }
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// 3. LOGIN USER
router.post('/login', async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Please provide both email/identifier, role, and password.' });
  }

  try {
    // Find User
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials or role selection mismatch.' });
    }

    // Match Password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid key token or database credential mismatch.' });
    }

    // Sign JWT Token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      }, 
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: `${user.firstName} ${user.lastName}`
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
