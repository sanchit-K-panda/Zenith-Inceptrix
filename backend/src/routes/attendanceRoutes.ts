import { Router } from 'express';
import {
  markAttendance,
  getStudentAttendance,
  getMyAttendance,
  updateAttendance
} from '../controllers/attendanceController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/mark', authenticate, authorize(['teacher']), markAttendance);
router.get('/student/:studentId', authenticate, getStudentAttendance);
router.get('/my-attendance', authenticate, getMyAttendance);
router.put('/:id', authenticate, authorize(['teacher']), updateAttendance);

export default router;
