import { Router } from 'express';
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote
} from '../controllers/noteController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createNote);
router.get('/', authenticate, getNotes);
router.put('/:id', authenticate, updateNote);
router.delete('/:id', authenticate, deleteNote);

export default router;
