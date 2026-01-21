import { Router } from 'express';
import {
  optimizeTimetable,
  getOptimizationLogs
} from '../controllers/optimizationController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/optimize-timetable', authenticate, authorize(['admin']), optimizeTimetable);
router.get('/logs', authenticate, authorize(['admin']), getOptimizationLogs);

export default router;
