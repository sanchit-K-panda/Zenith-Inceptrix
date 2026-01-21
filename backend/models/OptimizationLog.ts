import mongoose, { Schema, Document } from 'mongoose';

export interface IOptimizationLog extends Document {
  conflictType: string;
  originalTimetable: any;
  resolvedTimetable: any;
  resolution: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
}

const optimizationLogSchema = new Schema(
  {
    conflictType: {
      type: String,
      enum: ['teacher_clash', 'hall_double_booking', 'teacher_absence'],
      required: true
    },
    originalTimetable: Schema.Types.Mixed,
    resolvedTimetable: Schema.Types.Mixed,
    resolution: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['success', 'pending', 'failed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model<IOptimizationLog>('OptimizationLog', optimizationLogSchema);
