import mongoose, { Schema, Document } from 'mongoose';

export interface IMarks extends Document {
  student: mongoose.Types.ObjectId;
  subject: string;
  exam: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  teacher: mongoose.Types.ObjectId;
  publishedDate: Date;
}

const marksSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    exam: {
      type: String,
      required: true
    },
    marks: {
      type: Number,
      required: true
    },
    totalMarks: {
      type: Number,
      default: 100
    },
    percentage: Number,
    grade: String,
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true
    },
    publishedDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model<IMarks>('Marks', marksSchema);
