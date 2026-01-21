import { Router } from 'express';
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getStudentNotes
} from '../controllers/noteController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createNote);
router.get('/', authenticate, getNotes);
router.get('/student', authenticate, getStudentNotes);
router.put('/:id', authenticate, updateNote);
router.delete('/:id', authenticate, deleteNote);

export default router;
