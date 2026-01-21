import { Response } from 'express';
import Marks from '../models/Marks';
import Student from '../models/Student';
import { AuthRequest } from '../middleware/auth';

export const uploadMarks = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, subject, exam, marks, totalMarks } = req.body;

    const percentage = Math.round((marks / totalMarks) * 100);
    let grade = 'F';
    
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    const mark = await Marks.create({
      student: studentId,
      subject,
      exam,
      marks,
      totalMarks,
      percentage,
      grade,
      teacher: req.user?.id
    });

    res.status(201).json({ message: 'Marks uploaded', mark });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMarks = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId } = req.params;

    const marks = await Marks.find({ student: studentId })
      .populate('subject teacher')
      .sort({ createdAt: -1 });

    const averageMarks = marks.length > 0
      ? Math.round(marks.reduce((sum, m) => sum + m.percentage, 0) / marks.length)
      : 0;

    res.json({
      marks,
      statistics: {
        total: marks.length,
        averagePercentage: averageMarks
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyMarks = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.user?.id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const marks = await Marks.find({ student: student._id })
      .populate('subject teacher')
      .sort({ createdAt: -1 });

    const averageMarks = marks.length > 0
      ? Math.round(marks.reduce((sum, m) => sum + m.percentage, 0) / marks.length)
      : 0;

    res.json({
      marks,
      statistics: {
        total: marks.length,
        averagePercentage: averageMarks
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMarks = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { marks, totalMarks } = req.body;

    const percentage = Math.round((marks / totalMarks) * 100);
    let grade = 'F';
    
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    const mark = await Marks.findByIdAndUpdate(
      id,
      { marks, totalMarks, percentage, grade },
      { new: true }
    );

    res.json({ message: 'Marks updated', mark });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
