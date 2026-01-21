import mongoose, { Schema, Document } from 'mongoose';

export interface ITimetable extends Document {
  className: string;
  section: string;
  subject: string;
  teacher: mongoose.Types.ObjectId;
  hall: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  semester: string;
  academicYear: string;
}

const timetableSchema = new Schema(
  {
    className: {
      type: String,
      required: true
    },
    section: {
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
    hall: {
      type: String,
      required: true
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    semester: {
      type: String,
      required: true
    },
    academicYear: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<ITimetable>('Timetable', timetableSchema);
