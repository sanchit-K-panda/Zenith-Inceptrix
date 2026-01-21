import { Router } from 'express';
import {
  getTimetable,
  getTimetableWithAttendance,
  updateTimetable,
  createTimetable
} from '../controllers/timetableController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getTimetable);
router.get('/my-timetable', authenticate, getTimetableWithAttendance);
router.post('/', authenticate, authorize(['teacher', 'admin']), createTimetable);
router.put('/:id', authenticate, authorize(['teacher', 'admin']), updateTimetable);

export default router;
