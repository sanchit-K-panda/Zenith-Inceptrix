import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description: string;
  subject: string;
  teacher: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId[];
  dueDate: Date;
  attachments?: string[];
  submissions: {
    student: mongoose.Types.ObjectId;
    submittedAt: Date;
    fileUrl: string;
    status: 'submitted' | 'pending' | 'graded';
    grade?: number;
    feedback?: string;
  }[];
}

const assignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student'
      }
    ],
    dueDate: {
      type: Date,
      required: true
    },
    attachments: [String],
    submissions: [
      {
        student: {
          type: Schema.Types.ObjectId,
          ref: 'Student'
        },
        submittedAt: Date,
        fileUrl: String,
        status: {
          type: String,
          enum: ['submitted', 'pending', 'graded'],
          default: 'pending'
        },
        grade: Number,
        feedback: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>('Assignment', assignmentSchema);
