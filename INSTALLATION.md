# Smart Academic Dashboard - Installation Guide

## 🎯 Complete Step-by-Step Installation

Follow this guide to set up the Smart Academic Dashboard from scratch.

---

## Prerequisites Check

### Required Software
- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher (comes with Node.js)
- **MongoDB**: Version 4.4 or higher
- **Git**: For version control (optional)

### Check What You Have

```bash
# Check Node.js
node --version
# Should show: v16.0.0 or higher

# Check npm
npm --version
# Should show: 7.0.0 or higher

# Check MongoDB
mongosh --version
# Should show a version number
```

If any are missing, install them:
- **Node.js**: https://nodejs.org/
- **MongoDB**: https://www.mongodb.com/try/download/community

---

## Option 1: Automated Setup (Recommended)

### Windows Users
```bash
cd Inceptrix
setup.bat
```

### macOS/Linux Users
```bash
cd Inceptrix
chmod +x setup.sh
./setup.sh
```

The script will:
1. Install backend dependencies
2. Install frontend dependencies
3. Create environment files
4. Seed the database

**Then skip to "Running the Application"**

---

## Option 2: Manual Setup

### Step 1: Download and Extract

```bash
# Navigate to your projects folder
cd ~/projects

# Clone or download the Inceptrix folder
# If downloading from ZIP, extract it here
```

### Step 2: Backend Setup

#### 2a. Install Backend Dependencies

```bash
cd Inceptrix/backend
npm install
```

**Expected output:**
```
added XXX packages in X.XXs
```

#### 2b. Create Environment File

```bash
# Create .env from example
cp .env.example .env

# Or on Windows:
copy .env.example .env
```

**Verify `.env` contains:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-academic-dashboard
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

#### 2c. Verify MongoDB Connection

**Make sure MongoDB is running:**

**Windows:**
- Open Services (services.msc)
- Find "MongoDB Server"
- Status should be "Running"

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongodb
```

**Test connection:**
```bash
mongosh
# Should connect to MongoDB
# Exit with: exit
```

#### 2d: Seed the Database

```bash
npm run seed
```

**Expected output:**
```
MongoDB connected
Cleared existing data
Created users and basic profiles
Created timetable
Created attendance records
Created assignments
Created marks
Created notes
Database seeding completed successfully!

Test Credentials:
Admin: admin@dashboard.com / Admin@123
Teacher 1: teacher1@dashboard.com / Teacher@123
Teacher 2: teacher2@dashboard.com / Teacher@123
Student 1: student1@dashboard.com / Student@123
Student 2: student2@dashboard.com / Student@123
Parent 1: parent1@dashboard.com / Parent@123
```

**If seeding fails:**
- Verify MongoDB is running
- Check `.env` file settings
- Ensure MongoDB is accessible on localhost:27017

### Step 3: Frontend Setup

#### 3a. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

**Expected output:**
```
added XXX packages in X.XXs
```

#### 3b. Create Environment File

```bash
# Create .env.local from example
cp .env.local.example .env.local

# Or on Windows:
copy .env.local.example .env.local
```

**Verify `.env.local` contains:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Running the Application

### Terminal 1: Start Backend

```bash
cd Inceptrix/backend
npm run dev
```

**Expected output:**
```
Server is running on port 5000
MongoDB connected
```

**Backend is ready when you see:** ✅ Both messages above

### Terminal 2: Start Frontend

```bash
# Open a new terminal window
cd Inceptrix/frontend
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local
```

**Frontend is ready when you see:** ✅ "Local: http://localhost:3000"

### Step 4: Open in Browser

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the login page

---

## Testing the Setup

### Login Test

1. **Student Login:**
   - Email: `student1@dashboard.com`
   - Password: `Student@123`
   - Click "Sign In"
   - Should redirect to `/student/dashboard`

2. **Teacher Login:**
   - Email: `teacher1@dashboard.com`
   - Password: `Teacher@123`
   - Should redirect to `/teacher/dashboard`

3. **Parent Login:**
   - Email: `parent1@dashboard.com`
   - Password: `Parent@123`
   - Should redirect to `/parent/dashboard`

### What to Verify

- [ ] Login page loads
- [ ] Credentials work
- [ ] Dashboard loads for each role
- [ ] Data displays correctly
- [ ] No console errors
- [ ] Styling looks good

---

## Troubleshooting

### Problem: MongoDB Connection Failed

**Error message:**
```
MongooseError: Cannot connect to MongoDB
```

**Solutions:**
1. **Check MongoDB is running:**
   ```bash
   mongosh
   ```
   - Should connect without error
   - If fails, start MongoDB

2. **Check connection string:**
   - Look at `.env` file
   - Default: `mongodb://localhost:27017/smart-academic-dashboard`
   - Verify port 27017 is correct

3. **If using MongoDB Atlas (cloud):**
   - Get connection string from Atlas
   - Update `MONGODB_URI` in `.env`
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-academic-dashboard
   ```

### Problem: Port Already in Use

**Error message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. **Kill existing process:**
   - Mac/Linux: `lsof -i :5000` then `kill -9 <PID>`
   - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`

2. **Use different port:**
   - Edit `backend/.env`
   - Change `PORT=5001`
   - Update frontend: `NEXT_PUBLIC_API_URL=http://localhost:5001/api`

### Problem: Frontend Can't Connect to Backend

**Error message:**
```
Network Error: Cannot POST /api/auth/login
```

**Solutions:**
1. **Verify backend is running:**
   - Backend should say "Server is running on port 5000"

2. **Check API URL:**
   - Frontend `.env.local` should have:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **CORS Issue:**
   - Make sure backend is configured to accept localhost:3000
   - Restart both servers

### Problem: Login Fails with "Invalid Credentials"

**Error message:**
```
Invalid credentials
```

**Solutions:**
1. **Check email matches exactly:**
   - `student1@dashboard.com` (not student1@...)
   - Check for extra spaces

2. **Verify database was seeded:**
   ```bash
   cd backend
   npm run seed
   ```

3. **Reset database:**
   - Delete the MongoDB database
   - Run seed again

### Problem: Blank Page or 404 Error

**Error message:**
```
404 Not Found
```

**Solutions:**
1. **Make sure you're on correct URL:**
   - Landing page: `http://localhost:3000`
   - Login: `http://localhost:3000/login`

2. **Clear browser cache:**
   - Ctrl+Shift+Delete (Windows/Linux)
   - Cmd+Shift+Delete (Mac)

3. **Restart frontend:**
   - Stop `npm run dev`
   - Delete `.next` folder
   - Run `npm run dev` again

### Problem: Styling Issues (Ugly Page)

**Solutions:**
1. **Wait for CSS to load:**
   - Takes 2-3 seconds on first load

2. **Clear Tailwind cache:**
   ```bash
   cd frontend
   rm -rf .next node_modules/.cache
   npm run dev
   ```

3. **Check internet connection:**
   - Some CSS loads from CDN

---

## Environment Variables Explained

### Backend (.env)

```env
PORT=5000
# Port backend server runs on

MONGODB_URI=mongodb://localhost:27017/smart-academic-dashboard
# MongoDB connection string
# Local: mongodb://localhost:27017/database-name
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net/database-name

JWT_SECRET=your-secret-key
# Secret key for JWT tokens
# Change this in production!

NODE_ENV=development
# Environment mode
# Use "production" when deployed

FRONTEND_URL=http://localhost:3000
# Frontend URL for CORS
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
# Backend API URL
# Must start with NEXT_PUBLIC_ to be available in browser
```

---

## File Structure After Installation

```
Inceptrix/
├── backend/
│   ├── src/
│   │   ├── models/         ✓ Database schemas
│   │   ├── controllers/    ✓ Business logic
│   │   ├── routes/         ✓ API routes
│   │   ├── middleware/     ✓ Auth middleware
│   │   └── server.ts       ✓ Server entry
│   ├── node_modules/       ✓ Dependencies (after npm install)
│   ├── .env               ✓ Environment (after setup)
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/        ✓ Login pages
│   │   ├── student/       ✓ Student dashboard
│   │   ├── teacher/       ✓ Teacher dashboard
│   │   └── parent/        ✓ Parent dashboard
│   ├── lib/
│   │   ├── api/          ✓ API client
│   │   └── store/        ✓ State management
│   ├── node_modules/     ✓ Dependencies
│   ├── .env.local        ✓ Environment
│   ├── package.json
│   └── README.md
│
├── README.md             ✓ Main documentation
├── FEATURES.md           ✓ Feature list
└── setup.sh/.bat         ✓ Setup script
```

---

## Development Tips

### Using VS Code

1. **Open workspace:**
   ```bash
   code Inceptrix
   ```

2. **Split terminals:**
   - Ctrl+` to open terminal
   - Ctrl+Shift+` to add new terminal
   - Run backend in one, frontend in other

3. **Install extensions:**
   - ESLint
   - Prettier
   - Thunder Client (for API testing)

### API Testing

Use Thunder Client or Postman:
1. Start backend: `npm run dev`
2. Test endpoints:
   ```
   POST http://localhost:5000/api/auth/login
   Body: {"email":"student1@dashboard.com","password":"Student@123"}
   ```

### Database Exploration

```bash
# Connect to MongoDB
mongosh

# View databases
show dbs

# Use app database
use smart-academic-dashboard

# View collections
show collections

# View data
db.users.find()
db.students.find()
```

---

## Next Steps

1. **Read documentation:**
   - `backend/README.md` - API documentation
   - `frontend/README.md` - Frontend details
   - `FEATURES.md` - Complete feature list

2. **Explore the code:**
   - Check `backend/src/ai/timetableOptimizer.ts` for AI logic
   - Check `frontend/app/student/dashboard/page.tsx` for UI patterns

3. **Test all features:**
   - Login as different users
   - Try all buttons and links
   - Check console for errors

4. **Customize:**
   - Change colors in `frontend/app/globals.css`
   - Add your own data in `backend/src/seed.ts`
   - Modify dashboards as needed

---

## Getting Help

### Common Issues Checklist

- [ ] Node.js version 16+
- [ ] MongoDB running
- [ ] Both servers started
- [ ] Correct URLs (localhost:3000 and 5000)
- [ ] Demo credentials match exactly
- [ ] No typos in .env files
- [ ] Browser console shows no errors

### Where to Look

1. **Backend errors:** Check terminal where you ran `npm run dev`
2. **Frontend errors:** Check browser console (F12)
3. **Database errors:** Check MongoDB logs
4. **Network errors:** Check "Network" tab in DevTools

---

## Quick Commands Reference

```bash
# Backend
cd backend
npm install              # Install dependencies
npm run seed            # Seed database
npm run dev             # Start development server
npm run build           # Build for production
npm start               # Run production build

# Frontend
cd frontend
npm install             # Install dependencies
npm run dev             # Start development server
npm run build           # Build for production
npm start               # Run production build
npm run lint            # Check code quality

# Database
mongosh                 # Connect to MongoDB
show dbs               # List databases
use smart-academic-dashboard  # Select database
show collections       # List collections
db.users.find()        # View users
```

---

## Success Checklist

After setup, verify:
- [ ] Backend running on localhost:5000
- [ ] Frontend running on localhost:3000
- [ ] Login page loads
- [ ] Can login with demo credentials
- [ ] Student dashboard shows timetable
- [ ] Teacher dashboard shows classes
- [ ] Parent dashboard shows alerts
- [ ] No console errors
- [ ] All styling looks correct
- [ ] Data displays correctly

✅ **Setup Complete!**

---

## Production Deployment

When ready to deploy:

1. **Backend** (Heroku/Railway/Render):
   - Change `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Set up MongoDB Atlas
   - Configure CORS for production domain

2. **Frontend** (Vercel/Netlify/AWS):
   - Update `NEXT_PUBLIC_API_URL` to production backend
   - Run `npm run build`
   - Deploy built files

3. **Security:**
   - Use HTTPS/SSL
   - Use strong secrets
   - Set up CORS properly
   - Enable authentication

---

**Happy coding!** 🚀

For more help, see the main README.md file.
