import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  userId: mongoose.Types.ObjectId;
  employeeId: string;
  department: string;
  subjects: string[];
  qualifications: string[];
  assignedClasses: mongoose.Types.ObjectId[];
}

const teacherSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    employeeId: {
      type: String,
      required: true,
      unique: true
    },
    department: {
      type: String,
      required: true
    },
    subjects: [String],
    qualifications: [String],
    assignedClasses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Timetable'
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<ITeacher>('Teacher', teacherSchema);
