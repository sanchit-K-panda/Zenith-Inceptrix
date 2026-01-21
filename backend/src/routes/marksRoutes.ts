import { Router } from 'express';
import {
  uploadMarks,
  getMarks,
  getMyMarks,
  updateMarks
} from '../controllers/marksController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['teacher']), uploadMarks);
router.get('/student/:studentId', authenticate, getMarks);
router.get('/my-marks', authenticate, getMyMarks);
router.put('/:id', authenticate, authorize(['teacher']), updateMarks);

export default router;
