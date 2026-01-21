import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  student: mongoose.Types.ObjectId;
  timetableClass: mongoose.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'leave';
  markedBy: mongoose.Types.ObjectId;
  remarks?: string;
}

const attendanceSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    timetableClass: {
      type: Schema.Types.ObjectId,
      ref: 'Timetable',
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'leave'],
      required: true
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true
    },
    remarks: String
  },
  { timestamps: true }
);

attendanceSchema.index({ student: 1, date: 1 });

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);
