# Smart Academic Dashboard - Complete Setup Guide

## 🎓 Project Overview

**Smart Academic Dashboard** is a production-ready, full-stack web application for managing academic institutions. It features AI-powered timetable optimization, real-time attendance tracking, and role-based dashboards for students, teachers, and parents.

### ✨ Key Highlights
- **AI-Powered Timetable Optimization** - Automatic conflict detection and resolution
- **Role-Based Dashboards** - Customized interfaces for each user type
- **Real-Time Analytics** - Attendance, marks, and performance tracking
- **Direct Communication** - Teacher-parent messaging system
- **Modern Stack** - Next.js + Express + MongoDB + TypeScript

---

## 🚀 Quick Start

### Step 1: Backend Setup (Required First)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env if needed (defaults should work with local MongoDB)
# MONGODB_URI=mongodb://localhost:27017/smart-academic-dashboard
# JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Seed database with demo data
npm run seed

# Start backend server
npm run dev
```

**Backend runs on**: http://localhost:5000

### Step 2: Frontend Setup

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Ensure NEXT_PUBLIC_API_URL is set correctly
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start frontend development server
npm run dev
```

**Frontend runs on**: http://localhost:3000

### Step 3: Access the Application

1. Open browser to http://localhost:3000
2. Login with demo credentials:
   - **Student**: student1@dashboard.com / Student@123
   - **Teacher**: teacher1@dashboard.com / Teacher@123
   - **Parent**: parent1@dashboard.com / Parent@123

---

## 📋 Prerequisites

- **Node.js** 16 or higher
- **npm** or **yarn**
- **MongoDB** 4.4 or higher (local or Atlas)
- **Git** (for version control)

### Install MongoDB (Local Setup)

**Windows**:
1. Download from https://www.mongodb.com/try/download/community
2. Run installer and follow setup
3. MongoDB runs on localhost:27017 by default

**macOS** (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux** (Ubuntu/Debian):
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Or Use MongoDB Atlas** (Cloud):
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

---

## 📁 Project Structure

```
Inceptrix/
├── backend/
│   ├── src/
│   │   ├── models/          # Database schemas (User, Student, Teacher, etc.)
│   │   ├── controllers/     # Business logic & API handlers
│   │   ├── routes/          # API endpoints definition
│   │   ├── middleware/      # Auth & validation middleware
│   │   ├── ai/              # Timetable optimization engine
│   │   ├── server.ts        # Express server entry point
│   │   └── seed.ts          # Database seeding script
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/          # Login page
│   │   ├── student/         # Student dashboard
│   │   ├── teacher/         # Teacher dashboard
│   │   ├── parent/          # Parent dashboard
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable UI components
│   ├── lib/
│   │   ├── api/            # API client setup
│   │   └── store/          # Zustand state management
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── README.md
│
└── README.md (this file)
```

---

## 🗄️ Database Schema

### Collections Created

1. **Users** - Email, password, role, profile info
2. **Students** - Roll number, class, parent link
3. **Teachers** - Employee ID, department, subjects
4. **Parents** - Student relationships, notification prefs
5. **Timetables** - Class schedules with teacher & hall
6. **Attendance** - Per-student class attendance records
7. **Assignments** - Assignment details & submissions
8. **Marks** - Exam results with grades
9. **Notes** - Educational notes & resources
10. **Messages** - Direct teacher-parent messaging
11. **Notifications** - Event notifications
12. **OptimizationLogs** - AI optimization history

---

## 🔐 Authentication & Roles

### User Roles

| Role | Access | Features |
|------|--------|----------|
| **Student** | Own data only | Timetable, Attendance, Assignments, Notes |
| **Teacher** | Class data | Attendance marking, Assignment & marks upload |
| **Parent** | Child data | Attendance, Marks, Low attendance alerts |
| **Admin** | All data | Timetable optimization, System management |

### JWT Implementation
- Token expires in 7 days
- Automatically added to all API requests
- Stored in localStorage
- Cleared on logout

---

## 🎯 API Endpoints

### Authentication
```
POST   /api/auth/login          - Login user
POST   /api/auth/register       - Register user
GET    /api/auth/profile        - Get profile
PUT    /api/auth/profile        - Update profile
```

### Timetable
```
GET    /api/timetable           - Get all timetables
GET    /api/timetable/my-timetable  - Get my timetable
POST   /api/timetable           - Create timetable (Teacher/Admin)
PUT    /api/timetable/:id       - Update timetable
```

### Attendance
```
POST   /api/attendance/mark     - Mark attendance (Teacher)
GET    /api/attendance/my-attendance  - Get my attendance
GET    /api/attendance/student/:studentId  - Get student attendance
PUT    /api/attendance/:id      - Update attendance
```

### Assignments
```
POST   /api/assignments         - Create assignment
GET    /api/assignments         - Get assignments
POST   /api/assignments/:id/submit    - Submit assignment
PUT    /api/assignments/:id/grade/:submissionIndex  - Grade assignment
```

### Marks
```
POST   /api/marks               - Upload marks
GET    /api/marks/my-marks      - Get my marks
GET    /api/marks/student/:studentId - Get student marks
PUT    /api/marks/:id           - Update marks
```

### Optimization (Admin Only)
```
POST   /api/optimization/optimize-timetable  - Run optimization
GET    /api/optimization/logs              - Get optimization logs
```

---

## 🤖 AI Timetable Optimization

### How It Works

1. **Conflict Detection**
   - Identifies teacher double-bookings
   - Detects hall conflicts
   - Finds time overlaps

2. **Automatic Resolution**
   - Reassigns halls to available rooms
   - Finds substitute teachers
   - Logs all decisions

3. **Audit Trail**
   - Every optimization logged
   - Success/failure tracked
   - Resolution details saved

### Usage
```bash
curl -X POST http://localhost:5000/api/optimization/optimize-timetable \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

---

## 🎨 UI/UX Features

### Design System
- **Colors**: Professional blue, green, red, orange
- **Responsive**: Mobile, tablet, desktop optimized
- **Dark Mode**: Supported via next-themes
- **Animations**: Smooth transitions with Framer Motion

### Key Pages

| Page | Route | Features |
|------|-------|----------|
| **Login** | `/login` | Email/password authentication |
| **Student Dashboard** | `/student/dashboard` | Timetable, attendance, assignments |
| **Teacher Dashboard** | `/teacher/dashboard` | Classes, attendance marking, grading |
| **Parent Dashboard** | `/parent/dashboard` | Child progress, alerts, messaging |
| **Home** | `/` | Landing page with feature overview |

---

## 📊 Demo Data

### Seeded Users
After running `npm run seed`, the database includes:

**Teachers**:
- Dr. John Smith (Data Structures, Algorithms, DBMS)
- Ms. Sarah Johnson (Web Development, JavaScript, React)

**Students**:
- Alice Williams (Roll: STU001)
- Bob Davis (Roll: STU002)

**Parents**:
- Mr. Robert Williams

**Sample Data**:
- 3 classes per week
- 10 attendance records per student
- 2 assignments
- 3 mark entries
- Educational notes

---

## 🛠️ Development

### Running Both Servers Simultaneously

**Option 1: Two Terminal Windows**
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

**Option 2: Use concurrently (in root)**
```bash
# Install in root directory
npm install -g concurrently

# Then run from root
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

### Building for Production

**Backend**:
```bash
cd backend
npm run build
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm start
```

---

## 🐛 Troubleshooting

### Backend Won't Start
```
Error: MongoDB connection failed
✅ Solution: Ensure MongoDB is running
  - Windows: Check MongoDB service
  - Mac: brew services start mongodb-community
  - Linux: sudo systemctl start mongodb
```

### Frontend Can't Connect to API
```
Error: Cannot POST /api/auth/login
✅ Solution: 
  - Verify backend is running on port 5000
  - Check NEXT_PUBLIC_API_URL in .env.local
  - Ensure no firewall blocking localhost:5000
```

### Login Fails
```
Error: Invalid credentials
✅ Solution:
  - Verify demo credentials are correct
  - Check database was seeded: npm run seed
  - Try resetting MongoDB and reseeding
```

### Port Already in Use
```
Error: address already in use :::5000 (or 3000)
✅ Solution:
  - Find process: lsof -i :5000 (or :3000)
  - Kill process: kill -9 <PID>
  - Or change PORT in .env
```

---

## 📈 Scalability & Performance

### Optimizations Implemented
- Database indexing on frequently queried fields
- Efficient MongoDB aggregation
- JWT token caching
- Request validation before DB queries
- Responsive grid-based UI

### Production Ready
- Error handling on all endpoints
- CORS properly configured
- Input validation
- SQL injection prevention (MongoDB)
- XSS protection (React sanitization)

---

## 🔒 Security Features

### Backend
- Password hashing with bcryptjs (10 salt rounds)
- JWT token expiration
- Role-based access control
- Input validation on all endpoints
- CORS whitelist configuration

### Frontend
- Secure token storage
- Protected routes
- XSS protection
- HTTPS enforcement (in production)

---

## 📱 Responsive Design

Works perfectly on:
- **Desktop** (1920px+)
- **Tablet** (768px - 1024px)
- **Mobile** (320px - 768px)

---

## 🚀 Deployment Options

### Vercel (Frontend)
```bash
cd frontend
npm i -g vercel
vercel deploy
```

### Heroku (Backend)
```bash
cd backend
heroku create smart-academic-dashboard
git push heroku main
```

### Docker Compose
Create `docker-compose.yml` in root:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
  backend:
    build: ./backend
    ports:
      - "5000:5000"
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

---

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-academic-dashboard
JWT_SECRET=your-super-secret-key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🎓 Learning Resources

### Concepts Covered
- REST API design
- Database modeling
- JWT authentication
- Role-based access control
- React hooks & state management
- Next.js App Router
- MongoDB & Mongoose
- TypeScript best practices

### Files to Study
1. `/backend/src/ai/timetableOptimizer.ts` - AI logic
2. `/backend/src/middleware/auth.ts` - Authentication
3. `/frontend/lib/api/client.ts` - API integration
4. `/frontend/app/student/dashboard/page.tsx` - UI patterns

---

## 🏆 Hackathon Readiness

This project includes:
- ✅ Complete feature set
- ✅ Production-quality code
- ✅ Database seeding with demo data
- ✅ Comprehensive error handling
- ✅ Mobile-responsive design
- ✅ AI-powered optimization
- ✅ Full documentation
- ✅ Multiple user roles
- ✅ Real-world use cases

---

## 📞 Support & Questions

- Check README files in `/backend` and `/frontend`
- Review API endpoint documentation
- Check demo data seeding output
- Verify environment variables
- Check browser console for errors

---

## 📄 License

MIT License - Free to use and modify

---

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Follow TypeScript best practices
4. Submit pull request

---

## 🎉 Summary

You now have a complete, production-ready Smart Academic Dashboard with:
- Full-stack application
- AI timetable optimization
- Role-based dashboards
- Real-time data management
- Professional UI/UX
- Complete API documentation
- Database seeding
- Security best practices

**Happy coding!** 🚀

---

*Built for hackathons | Production-ready | Open Source*

Last updated: January 2025
