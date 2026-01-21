import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  rollNumber: string;
  parentId: mongoose.Types.ObjectId;
  className: string;
  section: string;
  enrollmentDate: Date;
  totalAttendance: number;
  averageMarks?: number;
}

const studentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Parent'
    },
    className: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    totalAttendance: {
      type: Number,
      default: 100
    },
    averageMarks: Number
  },
  { timestamps: true }
);

export default mongoose.model<IStudent>('Student', studentSchema);
