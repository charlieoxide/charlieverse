# Charlieverse - VS Code Setup Guide

This guide will help you set up the Charlieverse project in VS Code with all dependencies and PostgreSQL database.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed
- VS Code installed
- Git installed

## 1. Project Setup

### Clone and Install Dependencies

```bash
# Clone the project (if not already done)
git clone <your-repo-url>
cd charlieverse

# Install all dependencies
npm install

# Install global tools (optional but recommended)
npm install -g tsx drizzle-kit
```

### Required Dependencies

The project uses these main dependencies (already in package.json):

**Backend:**
- `express` - Web framework
- `express-session` - Session management
- `drizzle-orm` - Database ORM
- `@neondatabase/serverless` - PostgreSQL driver
- `bcrypt` - Password hashing
- `tsx` - TypeScript execution
- `drizzle-kit` - Database migrations

**Frontend:**
- `react` - Frontend framework
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `@tanstack/react-query` - Data fetching

## 2. Simple In-Memory Storage Setup

The application now uses simple in-memory storage - no database setup required!

Just create a `.env` file in project root:

```env
# Session Secret (generate a secure random string)
SESSION_SECRET=your_very_secure_session_secret_here
```

**Note:** Data will reset when the server restarts, but this makes setup much simpler for development and testing.

## 3. No Database Setup Required!

Since we're using in-memory storage, no database setup is needed. The application will automatically create sample data when it starts.

## 4. Development Setup

### VS Code Extensions (Recommended)

Install these VS Code extensions:
- ES7+ React/Redux/React-Native snippets
- TypeScript Hero
- Tailwind CSS IntelliSense
- PostgreSQL (by Chris Kolkman)
- Thunder Client (for API testing)

### Environment Configuration

Create `.env` file with all required variables:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Session
SESSION_SECRET=your_very_secure_session_secret_minimum_32_characters

# Optional: Firebase (if using Firebase auth)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 5. Running the Application

### Development Mode

```bash
# Start both frontend and backend
npm run dev

# Or run separately:
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend (if needed separately)
cd client && npm run dev
```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 6. Testing the Setup

1. **Database Connection:**
```bash
# Test database connection
node -e "
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
sql\`SELECT NOW()\`.then(console.log).catch(console.error);
"
```

2. **API Endpoints:**
   - `GET http://localhost:5000/api/auth/me` - Should return 401 (normal when not logged in)
   - `POST http://localhost:5000/api/auth/register` - User registration
   - `POST http://localhost:5000/api/auth/login` - User login

3. **Frontend:**
   - Open http://localhost:5000 in browser
   - Should see Charlieverse homepage

## 7. Common Issues and Solutions

### Database Connection Issues

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Test connection manually
psql -h localhost -U charlieverse_user -d charlieverse
```

### Port Conflicts

```bash
# Check what's using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process if needed
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Node.js Version Issues

```bash
# Check Node.js version
node --version  # Should be 18+

# Install correct version with nvm
nvm install 18
nvm use 18
```

## 8. Project Structure

```
charlieverse/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Authentication context
│   │   └── main.tsx       # Entry point
│   └── package.json
├── server/                # Express backend
│   ├── database.ts        # Database connection
│   ├── storage.ts         # Data access layer
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema
├── package.json           # Main dependencies
├── drizzle.config.ts      # Database configuration
└── .env                   # Environment variables
```

## 9. Default Admin User

After first run, a default admin user is created:
- Email: `admin@charlieverse.com`
- Password: `admin123`

**Important:** Change this password immediately in production!

## 10. Next Steps

1. Start the development server: `npm run dev`
2. Open http://localhost:5000
3. Register a new user or login with admin credentials
4. Begin developing your features

## Troubleshooting

If you encounter any issues:

1. Check the terminal output for error messages
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running and accessible
4. Check that all dependencies are installed: `npm install`
5. Try deleting `node_modules` and running `npm install` again

For additional help, check the logs in the terminal or browser developer console.