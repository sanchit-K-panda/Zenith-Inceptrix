import { Response } from 'express';
import timetableOptimizer from '../ai/timetableOptimizer';
import { AuthRequest } from '../middleware/auth';

export const optimizeTimetable = async (req: AuthRequest, res: Response) => {
  try {
    // Detect conflicts
    const conflicts = await timetableOptimizer.detectConflicts();

    if (conflicts.length === 0) {
      return res.json({
        message: 'No conflicts detected',
        conflicts: [],
        resolutions: []
      });
    }

    // Resolve conflicts
    const resolutions = await timetableOptimizer.resolveConflicts(conflicts);

    res.json({
      message: 'Timetable optimization completed',
      conflictsDetected: conflicts.length,
      conflicts,
      resolutions,
      summary: {
        totalConflicts: conflicts.length,
        resolved: resolutions.filter((r: any) => r.success).length,
        pending: resolutions.filter((r: any) => !r.success).length
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOptimizationLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { conflictType, status } = req.query;
    
    const query: any = {};
    if (conflictType) query.conflictType = conflictType;
    if (status) query.status = status;

    const OptimizationLog = (await import('../models/OptimizationLog')).default;
    const logs = await OptimizationLog
      .find(query)
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
