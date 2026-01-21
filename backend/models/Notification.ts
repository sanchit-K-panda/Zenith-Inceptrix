import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: 'attendance' | 'assignment' | 'marks' | 'message' | 'timetable' | 'general';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;
}

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['attendance', 'assignment', 'marks', 'message', 'timetable', 'general'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    link: String
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', notificationSchema);
