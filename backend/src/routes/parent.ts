import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middlewares/auth';
import { User, StudentProfile, Bill, Attendance, Announcement, ActivityLog } from '../models';

const router = Router();

router.use(authenticateToken);

// 1. GET LINKED CHILD'S PROGRESS PROFILE & METRICS
router.get('/dashboard', async (req: AuthRequest, res: Response) => {
  const parentPhone = req.user?.phone;

  if (!parentPhone) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  try {
    // Look up student profile matching parent contact phone
    const studentProfile = await StudentProfile.findOne({ parentPhone }).populate('userId');

    if (!studentProfile) {
      return res.status(404).json({ error: 'No linked child student profile found matching your parent contact phone ID.' });
    }

    const studentUser = studentProfile.userId as any;
    
    // Fetch upcoming announcements
    const announcements = await Announcement.find({}).sort({ _id: -1 });

    // Fetch monthly attendance logs for the child
    const attendances = await Attendance.find({ studentId: studentUser._id });

    return res.json({
      student: {
        id: studentUser._id,
        name: `${studentUser.firstName} ${studentUser.lastName}`,
        grade: studentProfile.grade,
        avgGrade: studentProfile.avgGrade,
        progress: studentProfile.progress, // attendance rate
        learningGoal: studentProfile.learningGoal
      },
      announcements,
      attendances: attendances.map(a => ({
        date: a.date,
        status: a.status
      }))
    });
  } catch (error) {
    console.error('Error fetching parent dashboard payload:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// 2. GET TUITION INVOICES LEDGER
router.get('/bills', async (req: AuthRequest, res: Response) => {
  const parentPhone = req.user?.phone;

  try {
    const studentProfile = await StudentProfile.findOne({ parentPhone });

    if (!studentProfile) {
      return res.status(404).json({ error: 'No child profiles linked.' });
    }

    const bills = await Bill.find({ studentId: studentProfile.userId });
    return res.json(bills);
  } catch (error) {
    console.error('Error loading parent invoices:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// 3. SECURE GATEWAY REMITTANCE PAYMENT
router.post('/bills/:billId/pay', async (req: AuthRequest, res: Response) => {
  const { billId } = req.params;
  const parentName = `${req.user?.firstName} ${req.user?.lastName}`;

  try {
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ error: 'Invoice billing card not found.' });
    }

    if (bill.status === 'Paid') {
      return res.status(400).json({ error: 'Invoice has already been paid.' });
    }

    const paidStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

    // Update status to Paid
    bill.status = 'Paid';
    bill.paidDate = paidStr;
    await bill.save();

    // Log Activity log
    await ActivityLog.create({
      studentName: 'Marcus Thorne', // In a production app, fetch from StudentUser profile
      type: 'Fee Payment',
      detail: `Tuition transaction of $${bill.amount} successfully settled online by parent ${parentName}.`,
      dateTime: 'Just now',
      amount: bill.amount,
      status: 'Completed'
    });

    return res.json({
      msg: 'Payment processed successfully. Balance cleared.',
      bill
    });
  } catch (error) {
    console.error('Error processing billing remittance:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
