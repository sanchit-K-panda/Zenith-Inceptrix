import { Response } from 'express';
import Assignment from '../models/Assignment';
import { AuthRequest } from '../middleware/auth';

export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, subject, assignedTo, dueDate, attachments } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      subject,
      teacher: req.user?.id,
      assignedTo,
      dueDate,
      attachments
    });

    res.status(201).json({ message: 'Assignment created', assignment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const { subject } = req.query;
    
    const query: any = { assignedTo: req.user?.id };
    if (subject) query.subject = subject;

    const assignments = await Assignment.find(query)
      .populate('teacher')
      .sort({ dueDate: 1 });

    res.json(assignments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { fileUrl } = req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      id,
      {
        $push: {
          submissions: {
            student: req.user?.id,
            submittedAt: new Date(),
            fileUrl,
            status: 'submitted'
          }
        }
      },
      { new: true }
    );

    res.json({ message: 'Assignment submitted', assignment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const gradeAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { id, submissionIndex } = req.params;
    const { grade, feedback } = req.body;

    const assignment = await Assignment.findById(id);
    
    if (assignment && assignment.submissions[parseInt(submissionIndex)]) {
      assignment.submissions[parseInt(submissionIndex)].grade = grade;
      assignment.submissions[parseInt(submissionIndex)].feedback = feedback;
      assignment.submissions[parseInt(submissionIndex)].status = 'graded';
      
      await assignment.save();
    }

    res.json({ message: 'Assignment graded', assignment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
