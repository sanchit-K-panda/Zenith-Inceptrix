import { Response } from 'express';
import Note from '../models/Note';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, subject, sharedWith, attachments } = req.body;

    // If teacher is creating note, auto-share with all students
    let finalSharedWith = sharedWith || [];
    if (req.user?.role === 'teacher' && (!sharedWith || sharedWith.length === 0)) {
      const students = await User.find({ role: 'student' }).select('_id');
      finalSharedWith = students.map(s => s._id);
    }

    const note = await Note.create({
      creator: req.user?.id,
      creatorRole: req.user?.role,
      title,
      content,
      subject,
      sharedWith: finalSharedWith,
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

// Get notes shared with the logged-in student (uploaded by teachers)
export const getStudentNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { subject } = req.query;

    const query: any = {
      sharedWith: req.user?.id,
      creatorRole: 'teacher'
    };

    if (subject) query.subject = subject;

    const notes = await Note.find(query)
      .populate('creator', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
