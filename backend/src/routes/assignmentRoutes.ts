import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  submitAssignment,
  gradeAssignment
} from '../controllers/assignmentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['teacher']), createAssignment);
router.get('/', authenticate, getAssignments);
router.post('/:id/submit', authenticate, authorize(['student']), submitAssignment);
router.put('/:id/grade/:submissionIndex', authenticate, authorize(['teacher']), gradeAssignment);

export default router;
