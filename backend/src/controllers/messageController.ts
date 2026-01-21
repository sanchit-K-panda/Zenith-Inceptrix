import { Response } from 'express';
import Message from '../models/Message';
import { AuthRequest } from '../middleware/auth';

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { recipientId, content } = req.body;

    const message = await Message.create({
      sender: req.user?.id,
      recipient: recipientId,
      content
    });

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user?.id, recipient: userId },
        { sender: userId, recipient: req.user?.id }
      ]
    })
    .populate('sender recipient')
    .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { recipient: req.user?.id, sender: userId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user?.id },
        { recipient: req.user?.id }
      ]
    })
    .populate('sender recipient')
    .sort({ createdAt: -1 });

    // Group by conversation
    const conversations = new Map();
    
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === req.user?.id
        ? msg.recipient._id.toString()
        : msg.sender._id.toString();
      
      if (!conversations.has(otherUser)) {
        conversations.set(otherUser, {
          userId: otherUser,
          user: msg.sender._id.toString() === req.user?.id ? msg.recipient : msg.sender,
          lastMessage: msg.content,
          timestamp: msg.createdAt,
          unread: !msg.read && msg.recipient._id.toString() === req.user?.id
        });
      }
    });

    res.json(Array.from(conversations.values()));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
