import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/authRoutes';
import timetableRoutes from './routes/timetableRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import marksRoutes from './routes/marksRoutes';
import noteRoutes from './routes/noteRoutes';
import messageRoutes from './routes/messageRoutes';
import optimizationRoutes from './routes/optimizationRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const DEMO_MODE = process.env.DEMO_MODE === 'true';

// Middleware
app.use(cors());
app.use(express.json());

// Demo users for testing without MongoDB
const demoUsers = [
  { id: 'demo-student-1', email: 'student@demo.com', password: 'demo123', firstName: 'Alice', lastName: 'Student', role: 'student' },
  { id: 'demo-teacher-1', email: 'teacher@demo.com', password: 'demo123', firstName: 'John', lastName: 'Teacher', role: 'teacher' },
  { id: 'demo-parent-1', email: 'parent@demo.com', password: 'demo123', firstName: 'Robert', lastName: 'Parent', role: 'parent' },
  { id: 'demo-admin-1', email: 'admin@demo.com', password: 'demo123', firstName: 'Admin', lastName: 'User', role: 'admin' },
];

// Demo login route (works without MongoDB)
app.post('/api/auth/demo-login', (req, res) => {
  const { email, password } = req.body;
  const user = demoUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'demo-secret',
    { expiresIn: '7d' }
  );
  
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }
  });
});

// Demo data endpoints
app.get('/api/timetable/my-timetable', (req, res) => {
  res.json([
    { _id: '1', subject: 'Mathematics', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:30', hall: 'A101', teacher: { userId: { firstName: 'Dr. John', lastName: 'Smith' } } },
    { _id: '2', subject: 'Physics', dayOfWeek: 'Monday', startTime: '11:00', endTime: '12:30', hall: 'B202', teacher: { userId: { firstName: 'Ms. Sarah', lastName: 'Johnson' } } },
    { _id: '3', subject: 'Computer Science', dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '10:30', hall: 'C303', teacher: { userId: { firstName: 'Dr. Mike', lastName: 'Brown' } } },
    { _id: '4', subject: 'English', dayOfWeek: 'Wednesday', startTime: '14:00', endTime: '15:30', hall: 'D404', teacher: { userId: { firstName: 'Mrs. Emily', lastName: 'Davis' } } },
    { _id: '5', subject: 'Chemistry', dayOfWeek: 'Thursday', startTime: '10:00', endTime: '11:30', hall: 'E505', teacher: { userId: { firstName: 'Dr. Lisa', lastName: 'Wilson' } } },
  ]);
});

app.get('/api/attendance/my-attendance', (req, res) => {
  res.json({
    attendance: [
      { _id: '1', date: new Date().toISOString(), status: 'present', timetable: { subject: 'Mathematics' } },
      { _id: '2', date: new Date(Date.now() - 86400000).toISOString(), status: 'present', timetable: { subject: 'Physics' } },
      { _id: '3', date: new Date(Date.now() - 172800000).toISOString(), status: 'absent', timetable: { subject: 'Chemistry' } },
    ],
    statistics: { percentage: 85, present: 42, absent: 5, late: 3, total: 50 }
  });
});

app.get('/api/marks/my-marks', (req, res) => {
  res.json({
    marks: [
      { _id: '1', subject: 'Mathematics', examType: 'Midterm', marksObtained: 85, totalMarks: 100 },
      { _id: '2', subject: 'Physics', examType: 'Midterm', marksObtained: 78, totalMarks: 100 },
    ],
    statistics: { averagePercentage: 82, totalExams: 5, passedExams: 5 }
  });
});

app.get('/api/assignments', (req, res) => {
  res.json([
    { _id: '1', title: 'Math Assignment 1', subject: 'Mathematics', dueDate: new Date(Date.now() + 604800000).toISOString(), description: 'Complete exercises 1-10', maxMarks: 100, submissions: [] },
    { _id: '2', title: 'Physics Lab Report', subject: 'Physics', dueDate: new Date(Date.now() + 259200000).toISOString(), description: 'Write lab report on experiment', maxMarks: 50, submissions: [] },
  ]);
});

app.get('/api/notes/student', (req, res) => {
  res.json([
    { _id: '1', title: 'Calculus Notes', subject: 'Mathematics', content: 'Integration and differentiation basics...', isShared: true, creator: { firstName: 'Dr. John', lastName: 'Smith', role: 'teacher' }, createdAt: new Date().toISOString() },
    { _id: '2', title: 'Newton Laws', subject: 'Physics', content: 'First law: An object at rest...', isShared: true, creator: { firstName: 'Ms. Sarah', lastName: 'Johnson', role: 'teacher' }, createdAt: new Date().toISOString() },
  ]);
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-academic-dashboard';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.log('MongoDB connection failed - Running in DEMO MODE');
    return false;
  }
};

// Routes (will work with MongoDB when connected)
app.use('/api/auth', authRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/optimization', optimizationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', demoMode: true });
});

// Start server (don't exit on MongoDB failure)
const startServer = async () => {
  const dbConnected = await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (!dbConnected) {
      console.log('='.repeat(50));
      console.log('DEMO MODE ACTIVE - Use these credentials:');
      console.log('Student: student@demo.com / demo123');
      console.log('Teacher: teacher@demo.com / demo123');
      console.log('Parent:  parent@demo.com / demo123');
      console.log('='.repeat(50));
    }
  });
};

startServer();

export default app;
