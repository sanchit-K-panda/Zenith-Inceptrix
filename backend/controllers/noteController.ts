import { Response } from 'express';
import Note from '../models/Note';
import { AuthRequest } from '../middleware/auth';

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, subject, sharedWith, attachments } = req.body;

    const note = await Note.create({
      creator: req.user?.id,
      creatorRole: req.user?.role,
      title,
      content,
      subject,
      sharedWith,
      attachments
    });

    res.status(201).json({ message: 'Note created', note });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { subject } = req.query;

    const query: any = {
      $or: [
        { creator: req.user?.id },
        { sharedWith: req.user?.id }
      ]
    };

    if (subject) query.subject = subject;

    const notes = await Note.find(query)
      .populate('creator')
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, subject, sharedWith } = req.body;

    const note = await Note.findByIdAndUpdate(
      id,
      { title, content, subject, sharedWith },
      { new: true }
    );

    res.json({ message: 'Note updated', note });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    await Note.findByIdAndDelete(id);
    res.json({ message: 'Note deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
