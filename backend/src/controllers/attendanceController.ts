import { Response } from 'express';
import Attendance from '../models/Attendance';
import Student from '../models/Student';
import { AuthRequest } from '../middleware/auth';

export const markAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, timetableClassId, status, remarks } = req.body;

    const attendance = await Attendance.create({
      student: studentId,
      timetableClass: timetableClassId,
      status,
      markedBy: req.user?.id,
      remarks,
      date: new Date()
    });

    res.status(201).json({ message: 'Attendance marked', attendance });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId } = req.params;
    
    const attendance = await Attendance.find({ student: studentId })
      .populate('timetableClass')
      .sort({ date: -1 });

    // Calculate attendance percentage
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    res.json({
      attendance,
      statistics: {
        total,
        present,
        absent: total - present,
        percentage
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.user?.id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const attendance = await Attendance.find({ student: student._id })
      .populate({
        path: 'timetableClass',
        select: 'subject dayOfWeek startTime endTime hall'
      })
      .sort({ date: -1 });

    // Transform attendance to include subject at top level for easier frontend access
    const transformedAttendance = attendance.map(record => {
      const obj = record.toObject();
      return {
        ...obj,
        subject: (obj.timetableClass as any)?.subject || 'Unknown',
        timetable: obj.timetableClass
      };
    });

    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    res.json({
      attendance: transformedAttendance,
      statistics: {
        total,
        present,
        absent,
        late,
        percentage
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { status, remarks },
      { new: true }
    );

    res.json({ message: 'Attendance updated', attendance });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
