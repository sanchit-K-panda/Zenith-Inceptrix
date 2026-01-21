# Smart Academic Dashboard - Frontend

A modern, responsive Next.js application for an intelligent timetable and academic management system with role-based dashboards.

## Features

### Student Dashboard
- View personalized timetable with attendance indicators
- Real-time attendance statistics
- Assignment submissions
- Academic performance tracking
- Notes management
- Direct teacher communication

### Teacher Dashboard
- View and manage assigned classes
- Mark student attendance
- Create and manage assignments
- Upload marks with automatic grading
- Share educational notes
- View student performance analytics

### Parent Dashboard
- Monitor child's attendance (with low attendance alerts)
- View academic performance and marks
- Track assignments
- Direct messaging with teachers
- Receive notifications
- Performance trend analysis

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **Calendar**: FullCalendar
- **Icons**: Lucide React
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Theme**: next-themes (Dark/Light mode)

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   └── login/
│   ├── student/          # Student dashboard
│   ├── teacher/          # Teacher dashboard
│   ├── parent/           # Parent dashboard
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # shadcn components
│   └── [feature]/        # Feature components
├── lib/
│   ├── api/              # API client
│   └── store/            # Zustand stores
├── services/             # API services
└── package.json
```

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

1. **Clone and install dependencies**
```bash
cd frontend
npm install
```

2. **Configure environment variables**
```bash
cp .env.local.example .env.local
# Edit with your backend API URL (default: http://localhost:5000/api)
```

3. **Start the development server**
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

The `NEXT_PUBLIC_` prefix makes the variable accessible in the browser.

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## Authentication

The app uses JWT-based authentication:

1. User logs in with email and password
2. Backend returns JWT token
3. Token stored in localStorage
4. Automatically added to all API requests
5. Token included in Authorization header: `Bearer {token}`

### Login Flow
1. User visits `/login`
2. Enters credentials
3. Token received and stored
4. Redirected to role-specific dashboard:
   - Student → `/student/dashboard`
   - Teacher → `/teacher/dashboard`
   - Parent → `/parent/dashboard`

## State Management

Using Zustand for auth state:

```typescript
const { user, token, login, logout } = useAuthStore()

// Login
login(user, token)

// Logout
logout()
```

## API Integration

Axios client with automatic token injection:

```typescript
import { 
  timetableAPI, 
  attendanceAPI, 
  assignmentAPI 
} from '@/lib/api/client'

// API calls include token automatically
const response = await timetableAPI.getMyTimetable()
```

## Dashboard Features

### Student Dashboard
- **Stats**: Attendance %, Average Marks, Assignments, Classes
- **Timetable**: Day-wise class schedule with attendance status
- **Assignments**: Recent assignments with submission status
- **Attendance Trend**: Visual attendance percentage
- **Academic Performance**: Average score display

### Teacher Dashboard
- **Stats**: Total Classes, Students, Assignments, Pending Reviews
- **My Classes**: Editable timetable with attendance marking
- **Assignments**: Create, manage, and grade assignments
- **Student Performance**: Class-wise analytics
- **Quick Actions**: Mark attendance, upload marks

### Parent Dashboard
- **Alert System**: Low attendance notifications
- **Stats**: Attendance %, Average Marks, Classes Present/Missed
- **Attendance Summary**: Visual progress bar
- **Academic Performance**: Performance status indicator
- **Teacher Communication**: Direct messaging interface

## UI/UX Highlights

### Design System
- **Colors**: Blue primary, Green success, Red danger, Orange warning
- **Layout**: Max-width 7xl container with responsive padding
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Typography**: Clear hierarchy with font weights

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid layouts with auto-fitting columns
- Touch-friendly buttons (min 44px height)

### Dark Mode Support
```typescript
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
```

## Components

### Page Components
- `LoginPage` - Authentication
- `StudentDashboard` - Student home
- `TeacherDashboard` - Teacher home
- `ParentDashboard` - Parent home
- `HomePage` - Landing page

### Feature Components
- Timetable view
- Attendance tracker
- Assignment list
- Marks display
- Notes editor
- Message interface

## API Endpoints Used

### Authentication
- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/profile`

### Timetable
- `GET /timetable/my-timetable`

### Attendance
- `GET /attendance/my-attendance`

### Assignments
- `GET /assignments`
- `POST /assignments/:id/submit`

### Marks
- `GET /marks/my-marks`

### Messages
- `GET /messages/conversations`

## Demo Credentials

```
Student: student1@dashboard.com / Student@123
Teacher: teacher1@dashboard.com / Teacher@123
Parent: parent1@dashboard.com / Parent@123
```

## Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting by route
- Lazy loading components
- Efficient re-renders with useCallback
- API response caching in state

## Security Features

- JWT token-based authentication
- Secure token storage
- HTTPS only in production
- Input validation
- Protected routes
- XSS protection with React

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Guidelines

### Adding New Pages
1. Create folder under `app/`
2. Add `page.tsx`
3. Use layout for shared components

### Adding API Calls
1. Add endpoint to `lib/api/client.ts`
2. Use in components with try-catch
3. Display loading states

### Styling
1. Use Tailwind classes
2. Follow color system
3. Maintain responsive design

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup
1. Set `NEXT_PUBLIC_API_URL` to production backend
2. Ensure CORS is configured properly
3. Use HTTPS for API calls
4. Configure SSL/TLS

## Troubleshooting

### Login Issues
- Check backend is running on port 5000
- Verify API URL in `.env.local`
- Check demo credentials in backend

### Data Not Loading
- Verify JWT token in localStorage
- Check Network tab in DevTools
- Ensure backend API is accessible

### Styling Issues
- Clear `.next` folder
- Run `npm run build` again
- Check Tailwind config

## Future Enhancements

- Real-time notifications with WebSocket
- Calendar integration (FullCalendar)
- File upload for assignments
- Chatbot assistant for students
- Advanced analytics dashboard
- Mobile app (React Native)

## Contributing

1. Create feature branch
2. Follow TypeScript strict mode
3. Use functional components
4. Add proper error handling
5. Submit pull request

## License

MIT License - See LICENSE file for details

## Support

For help:
1. Check demo credentials
2. Verify backend is running
3. Review API documentation
4. Check browser console for errors

---

Built with ❤️ for smart academic management
