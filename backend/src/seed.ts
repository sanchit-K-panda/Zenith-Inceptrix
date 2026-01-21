import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Import models
import User from './models/User';
import Student from './models/Student';
import Teacher from './models/Teacher';
import Parent from './models/Parent';
import Timetable from './models/Timetable';
import Attendance from './models/Attendance';
import Assignment from './models/Assignment';
import Marks from './models/Marks';
import Note from './models/Note';

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-academic-dashboard';
    await mongoose.connect(mongoUri);

    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Parent.deleteMany({}),
      Timetable.deleteMany({}),
      Attendance.deleteMany({}),
      Assignment.deleteMany({}),
      Marks.deleteMany({})
    ]);

    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@dashboard.com',
      password: 'Admin@123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    // Create teachers
    const teacher1User = await User.create({
      email: 'teacher1@dashboard.com',
      password: 'Teacher@123',
      firstName: 'Dr. John',
      lastName: 'Smith',
      role: 'teacher',
      phone: '+1-555-0101'
    });

    const teacher2User = await User.create({
      email: 'teacher2@dashboard.com',
      password: 'Teacher@123',
      firstName: 'Ms. Sarah',
      lastName: 'Johnson',
      role: 'teacher',
      phone: '+1-555-0102'
    });

    const teacher1 = await Teacher.create({
      userId: teacher1User._id,
      employeeId: 'EMP001',
      department: 'Computer Science',
      subjects: ['Data Structures', 'Algorithms', 'Database Management Systems']
    });

    const teacher2 = await Teacher.create({
      userId: teacher2User._id,
      employeeId: 'EMP002',
      department: 'Computer Science',
      subjects: ['Web Development', 'JavaScript', 'React']
    });

    // Create parents
    const parent1User = await User.create({
      email: 'parent1@dashboard.com',
      password: 'Parent@123',
      firstName: 'Mr. Robert',
      lastName: 'Williams',
      role: 'parent',
      phone: '+1-555-0201'
    });

    const parent1 = await Parent.create({
      userId: parent1User._id,
      relationship: 'father',
      occupation: 'Software Engineer'
    });

    // Create students
    const student1User = await User.create({
      email: 'student1@dashboard.com',
      password: 'Student@123',
      firstName: 'Alice',
      lastName: 'Williams',
      role: 'student',
      phone: '+1-555-0301'
    });

    const student1 = await Student.create({
      userId: student1User._id,
      rollNumber: 'STU001',
      parentId: parent1._id,
      className: 'III B.Tech',
      section: 'A'
    });

    const student2User = await User.create({
      email: 'student2@dashboard.com',
      password: 'Student@123',
      firstName: 'Bob',
      lastName: 'Davis',
      role: 'student'
    });

    const student2 = await Student.create({
      userId: student2User._id,
      rollNumber: 'STU002',
      parentId: parent1._id,
      className: 'III B.Tech',
      section: 'A'
    });

    console.log('Created users and basic profiles');

    // Create timetable
    const timetable1 = await Timetable.create({
      className: 'III B.Tech',
      section: 'A',
      subject: 'Data Structures',
      teacher: teacher1._id,
      hall: 'A101',
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      semester: '5',
      academicYear: '2024-2025'
    });

    const timetable2 = await Timetable.create({
      className: 'III B.Tech',
      section: 'A',
      subject: 'Web Development',
      teacher: teacher2._id,
      hall: 'B101',
      dayOfWeek: 'Tuesday',
      startTime: '10:30',
      endTime: '12:00',
      semester: '5',
      academicYear: '2024-2025'
    });

    const timetable3 = await Timetable.create({
      className: 'III B.Tech',
      section: 'A',
      subject: 'Database Management Systems',
      teacher: teacher1._id,
      hall: 'A102',
      dayOfWeek: 'Wednesday',
      startTime: '09:00',
      endTime: '10:30',
      semester: '5',
      academicYear: '2024-2025'
    });

    console.log('Created timetable');

    // Create attendance records
    const today = new Date();
    
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      await Attendance.create({
        student: student1._id,
        timetableClass: timetable1._id,
        date,
        status: i < 8 ? 'present' : 'absent',
        markedBy: teacher1._id
      });

      await Attendance.create({
        student: student2._id,
        timetableClass: timetable2._id,
        date,
        status: 'present',
        markedBy: teacher2._id
      });
    }

    console.log('Created attendance records');

    // Create assignments
    const assignment1 = await Assignment.create({
      title: 'Binary Tree Implementation',
      description: 'Implement binary tree operations including insertion, deletion, and traversal',
      subject: 'Data Structures',
      teacher: teacher1._id,
      assignedTo: [student1._id, student2._id],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      attachments: []
    });

    const assignment2 = await Assignment.create({
      title: 'Personal Portfolio Website',
      description: 'Create a responsive personal portfolio website using React',
      subject: 'Web Development',
      teacher: teacher2._id,
      assignedTo: [student1._id, student2._id],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      attachments: []
    });

    console.log('Created assignments');

    // Create marks
    await Marks.create({
      student: student1._id,
      subject: 'Data Structures',
      exam: 'Midterm Exam',
      marks: 42,
      totalMarks: 50,
      percentage: 84,
      grade: 'A',
      teacher: teacher1._id
    });

    await Marks.create({
      student: student1._id,
      subject: 'Web Development',
      exam: 'Midterm Exam',
      marks: 45,
      totalMarks: 50,
      percentage: 90,
      grade: 'A+',
      teacher: teacher2._id
    });

    await Marks.create({
      student: student2._id,
      subject: 'Data Structures',
      exam: 'Midterm Exam',
      marks: 38,
      totalMarks: 50,
      percentage: 76,
      grade: 'B',
      teacher: teacher1._id
    });

    console.log('Created marks');

    // Create notes (shared by teachers to students)
    await Note.create({
      creator: teacher1User._id,
      creatorRole: 'teacher',
      title: 'Introduction to Trees',
      content: 'A comprehensive overview of tree data structures including binary trees, AVL trees, and B-trees.',
      subject: 'Data Structures',
      sharedWith: [student1User._id, student2User._id],
      attachments: ['https://example.com/notes/trees.pdf']
    });

    await Note.create({
      creator: teacher1User._id,
      creatorRole: 'teacher',
      title: 'Sorting Algorithms Comparison',
      content: 'Detailed comparison of QuickSort, MergeSort, HeapSort with time complexity analysis.',
      subject: 'Data Structures',
      sharedWith: [student1User._id, student2User._id],
      attachments: ['https://example.com/notes/sorting.pdf']
    });

    await Note.create({
      creator: teacher2User._id,
      creatorRole: 'teacher',
      title: 'React Hooks Tutorial',
      content: 'Learn useState, useEffect, useContext, and custom hooks with practical examples.',
      subject: 'Web Development',
      sharedWith: [student1User._id, student2User._id],
      attachments: ['https://example.com/notes/react-hooks.pdf']
    });

    await Note.create({
      creator: teacher2User._id,
      creatorRole: 'teacher',
      title: 'REST API Design Best Practices',
      content: 'Guide to designing clean, maintainable REST APIs with Node.js and Express.',
      subject: 'Web Development',
      sharedWith: [student1User._id, student2User._id],
      attachments: ['https://example.com/notes/rest-api.pdf']
    });

    await Note.create({
      creator: teacher1User._id,
      creatorRole: 'teacher',
      title: 'SQL vs NoSQL Databases',
      content: 'When to use SQL databases vs NoSQL databases with real-world examples.',
      subject: 'Database Management Systems',
      sharedWith: [student1User._id, student2User._id],
      attachments: ['https://example.com/notes/databases.pdf']
    });

    console.log('Created notes');

    console.log('Database seeding completed successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@dashboard.com / Admin@123');
    console.log('Teacher 1: teacher1@dashboard.com / Teacher@123');
    console.log('Teacher 2: teacher2@dashboard.com / Teacher@123');
    console.log('Student 1: student1@dashboard.com / Student@123');
    console.log('Student 2: student2@dashboard.com / Student@123');
    console.log('Parent 1: parent1@dashboard.com / Parent@123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
