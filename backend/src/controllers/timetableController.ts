import { Response } from 'express';
import Timetable from '../models/Timetable';
import Attendance from '../models/Attendance';
import Student from '../models/Student';
import { AuthRequest } from '../middleware/auth';

export const getTimetable = async (req: AuthRequest, res: Response) => {
  try {
    const { className, section, semester } = req.query;

    const query: any = {};
    if (className) query.className = className;
    if (section) query.section = section;
    if (semester) query.semester = semester;

    const timetable = await Timetable.find(query).populate({
      path: 'teacher',
      populate: { path: 'userId', select: 'firstName lastName email' }
    });
    res.json(timetable);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTimetableWithAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.user?.id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const timetable = await Timetable.find({
      className: student.className,
      section: student.section
    }).populate({
      path: 'teacher',
      populate: { path: 'userId', select: 'firstName lastName email' }
    });

    // Get attendance for this student
    const attendance = await Attendance.find({
      student: student._id
    });

    // Merge attendance into timetable
    const timetableWithAttendance = timetable.map(slot => ({
      ...slot.toObject(),
      attendance: attendance.filter(a => a.timetableClass.toString() === slot._id.toString())
    }));

    res.json(timetableWithAttendance);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTimetable = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const timetable = await Timetable.findByIdAndUpdate(id, updates, { new: true });
    res.json({ message: 'Timetable updated', timetable });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTimetable = async (req: AuthRequest, res: Response) => {
  try {
    const timetable = await Timetable.create(req.body);
    res.status(201).json({ message: 'Timetable created', timetable });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
