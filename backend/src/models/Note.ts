import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  creator: mongoose.Types.ObjectId;
  creatorRole: 'student' | 'teacher';
  title: string;
  content: string;
  subject?: string;
  sharedWith: mongoose.Types.ObjectId[];
  attachments?: string[];
}

const noteSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    creatorRole: {
      type: String,
      enum: ['student', 'teacher'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    subject: String,
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    attachments: [String]
  },
  { timestamps: true }
);

export default mongoose.model<INote>('Note', noteSchema);
