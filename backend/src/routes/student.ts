import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middlewares/auth';
import { 
  StudentProfile, 
  Course, 
  ExamResult, 
  ExamSchedule, 
  Quiz, 
  QuizSubmission, 
  Attendance, 
  IQuizQuestion 
} from '../models';

const router = Router();

router.use(authenticateToken);

// 1. GET STUDENT DASHBOARD PAYLOAD PACKAGES
router.get('/dashboard', async (req: AuthRequest, res: Response) => {
  const studentId = req.user?.id;

  if (!studentId) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  try {
    // Fetch profile details
    const profile = await StudentProfile.findOne({ userId: studentId });

    // Fetch courses (for demo, retrieve all courses since there isn't a strict enrollment register table)
    const courses = await Course.find({}).lean();
    
    // Fetch exam results
    const exams = await ExamResult.find({ studentId });

    // Fetch upcoming exams
    const upcomingExams = await ExamSchedule.find({});

    // Fetch published quizzes
    const quizzes = await Quiz.find({});

    // Fetch monthly attendance logs
    const attendances = await Attendance.find({ studentId });

    return res.json({
      gpa: profile?.avgGrade || 3.8,
      attendanceRate: profile?.progress || 98,
      courses,
      exams,
      upcomingExams,
      quizzes,
      attendances: attendances.map(a => ({
        date: a.date,
        status: a.status
      }))
    });
  } catch (error) {
    console.error('Error fetching student dashboard context:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// 2. SUBMIT RESPONSES FOR TOPIC QUIZ
router.post('/quizzes/:quizId/submit', async (req: AuthRequest, res: Response) => {
  const { quizId } = req.params;
  const { answers } = req.body; // e.g. { 1: "A", 2: "B" }
  const studentId = req.user?.id;

  if (!answers || !studentId) {
    return res.status(400).json({ error: 'Submission answers are required.' });
  }

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found.' });
    }

    let score = 0;
    const questions: IQuizQuestion[] = quiz.questions;

    // Evaluate answers
    questions.forEach((q) => {
      const studentAns = answers[q.id];
      if (studentAns === q.correctAnswer) {
        score++;
      }
    });

    // Save quiz submission registry
    const submission = await QuizSubmission.create({
      quizId,
      studentId,
      answers,
      score,
      total: questions.length
    });

    return res.status(201).json({
      submissionId: submission._id,
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100)
    });
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
