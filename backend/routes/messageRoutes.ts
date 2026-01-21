import { Router } from 'express';
import {
  sendMessage,
  getConversation,
  getConversations
} from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/send', authenticate, sendMessage);
router.get('/conversations', authenticate, getConversations);
router.get('/conversation/:userId', authenticate, getConversation);

export default router;
