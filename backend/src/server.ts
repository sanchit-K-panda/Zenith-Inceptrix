import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

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

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-academic-dashboard';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Routes
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
  res.json({ status: 'Server is running' });
});

// Connect and start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

export default app;
