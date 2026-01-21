import mongoose, { Schema, Document } from 'mongoose';

export interface IParent extends Document {
  userId: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  occupation?: string;
  relationship: 'mother' | 'father' | 'guardian';
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    lowAttendanceAlert: boolean;
  };
}

const parentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student'
      }
    ],
    occupation: String,
    relationship: {
      type: String,
      enum: ['mother', 'father', 'guardian'],
      required: true
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      lowAttendanceAlert: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IParent>('Parent', parentSchema);
