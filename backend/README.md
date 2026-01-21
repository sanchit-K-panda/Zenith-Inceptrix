# Smart Academic Dashboard - Backend

A production-ready REST API for an intelligent timetable and academic management system with AI-powered timetable optimization.

## Features

### Core Features
- **JWT Authentication** with role-based access control
- **User Management** for Students, Teachers, Parents, and Admins
- **Timetable Management** with real-time synchronization
- **Attendance Tracking** with automatic percentage calculations
- **Assignment System** with submission and grading
- **Marks Management** with automatic grade calculation
- **Notes System** for educational content sharing
- **Messaging System** for teacher-parent communication
- **Notifications** for various academic events

### AI Features
- **Conflict Detection**: Identifies teacher clashes and hall double-bookings
- **Automatic Resolution**: Suggests and applies optimal solutions
- **Substitute Assignment**: Automatically assigns substitute teachers when needed
- **Hall Reassignment**: Finds alternative halls for classes
- **Optimization Logging**: Maintains detailed logs of all optimizations

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Project Structure

```
backend/
├── src/
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   ├── ai/              # Optimization engine
│   ├── server.ts        # Express server
│   └── seed.ts          # Database seeding
├── package.json
├── tsconfig.json
└── .env.example
```

## Database Collections

### Users
- Stores user credentials and basic info
- Relationships: Student, Teacher, Parent

### Student
- Roll number, class, section
- Parent assignment
- Enrollment date

### Teacher
- Employee ID, department
- Subject expertise
- Assigned classes

### Parent
- Student relationships
- Notification preferences
- Contact information

### Timetable
- Class schedule details
- Teacher & hall assignment
- Day, time, subject info

### Attendance
- Per-student attendance records
- Marked by teachers
- Status (present/absent/leave)

### Assignment
- Assignment details
- Student submissions
- Grading & feedback

### Marks
- Exam results
- Grade calculation
- Publication status

### Note
- Educational notes
- Shared content
- Creator & visibility

### Notification
- User notifications
- Read status
- Multiple types

### Message
- Direct messaging
- Teacher-parent communication
- Read tracking

### OptimizationLog
- Conflict logs
- Resolution history
- Success/failure status

## Installation

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- npm or yarn

### Setup

1. **Clone and install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

3. **Seed the database with demo data**
```bash
npm run seed
```

4. **Start the development server**
```bash
npm run dev
```

The API will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Timetable
- `GET /api/timetable` - Get all timetables
- `GET /api/timetable/my-timetable` - Get my timetable (Student)
- `POST /api/timetable` - Create timetable (Teacher/Admin)
- `PUT /api/timetable/:id` - Update timetable (Teacher/Admin)

### Attendance
- `POST /api/attendance/mark` - Mark attendance (Teacher)
- `GET /api/attendance/my-attendance` - Get my attendance (Student)
- `GET /api/attendance/student/:studentId` - Get student attendance
- `PUT /api/attendance/:id` - Update attendance (Teacher)

### Assignments
- `POST /api/assignments` - Create assignment (Teacher)
- `GET /api/assignments` - Get my assignments (Student)
- `POST /api/assignments/:id/submit` - Submit assignment (Student)
- `PUT /api/assignments/:id/grade/:submissionIndex` - Grade assignment (Teacher)

### Marks
- `POST /api/marks` - Upload marks (Teacher)
- `GET /api/marks/my-marks` - Get my marks (Student)
- `GET /api/marks/student/:studentId` - Get student marks
- `PUT /api/marks/:id` - Update marks (Teacher)

### Notes
- `POST /api/notes` - Create note
- `GET /api/notes` - Get notes
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/conversation/:userId` - Get conversation
- `GET /api/messages/conversations` - Get all conversations

### Optimization
- `POST /api/optimization/optimize-timetable` - Run optimization (Admin)
- `GET /api/optimization/logs` - Get optimization logs (Admin)

## Demo Credentials

```
Admin:
Email: admin@dashboard.com
Password: Admin@123

Teacher 1:
Email: teacher1@dashboard.com
Password: Teacher@123

Teacher 2:
Email: teacher2@dashboard.com
Password: Teacher@123

Student 1:
Email: student1@dashboard.com
Password: Student@123

Student 2:
Email: student2@dashboard.com
Password: Student@123

Parent 1:
Email: parent1@dashboard.com
Password: Parent@123
```

## AI Timetable Optimization

The optimization engine automatically:

1. **Detects Conflicts**
   - Teacher double-booking
   - Hall conflicts
   - Time overlaps

2. **Resolves Issues**
   - Reassigns halls
   - Finds substitute teachers
   - Logs all changes

3. **Provides Insights**
   - Conflict types
   - Resolution success rate
   - Audit trail

### Usage
```bash
curl -X POST http://localhost:5000/api/optimization/optimize-timetable \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Error Handling

All endpoints return structured error responses:

```json
{
  "message": "Error description",
  "statusCode": 400,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

Common status codes:
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

## Development

### Building
```bash
npm run build
```

### Production
```bash
npm run start
```

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-academic-dashboard
JWT_SECRET=your-super-secret-key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Performance Optimizations

- Database indexing on frequently queried fields
- JWT caching in middleware
- Request validation before database queries
- Efficient MongoDB aggregation pipelines

## Security Features

- Password hashing with bcryptjs (salt rounds: 10)
- JWT token expiration (7 days)
- Role-based access control (RBAC)
- Input validation on all endpoints
- CORS protection

## Testing

For production deployment:
1. Run with NODE_ENV=production
2. Use strong JWT_SECRET
3. Configure MongoDB with authentication
4. Set up proper email service
5. Enable HTTPS/SSL

## Contributing

This is a hackathon project. For improvements:
1. Clone the repository
2. Create a feature branch
3. Submit pull requests
4. Follow TypeScript best practices

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Check the API documentation
- Review error messages
- Check database seeding
- Verify environment variables

---

Built with ❤️ for smart academic management
