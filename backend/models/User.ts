import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'parent', 'admin'],
      required: true
    },
    avatar: String,
    phone: String
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password: string) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
