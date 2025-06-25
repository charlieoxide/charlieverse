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

## 2. PostgreSQL Database Setup

### Option A: Local PostgreSQL Installation

1. **Install PostgreSQL:**

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql
```

**macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

2. **Create Database and User:**

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE charlieverse;
CREATE USER charlieverse_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE charlieverse TO charlieverse_user;
\q
```

3. **Set Environment Variable:**

Create `.env` file in project root:
```env
DATABASE_URL=postgresql://charlieverse_user:your_secure_password@localhost:5432/charlieverse
SESSION_SECRET=your_very_secure_session_secret_here
```

### Option B: Cloud PostgreSQL (Neon/Supabase)

**Using Neon (Recommended):**

1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string
5. Add to `.env`:

```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
SESSION_SECRET=your_very_secure_session_secret_here
```

**Using Supabase:**

1. Go to https://supabase.com
2. Create project
3. Get connection string from Settings > Database
4. Add to `.env`

### Option C: Docker PostgreSQL (Quick Setup)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: charlieverse
      POSTGRES_USER: charlieverse_user
      POSTGRES_PASSWORD: your_secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up -d
```

Add to `.env`:
```env
DATABASE_URL=postgresql://charlieverse_user:your_secure_password@localhost:5432/charlieverse
SESSION_SECRET=your_very_secure_session_secret_here
```

## 3. Database Schema Setup

After setting up PostgreSQL and environment variables:

```bash
# Push database schema
npm run db:push

# Verify schema was created
npx drizzle-kit studio
# This opens a web interface to view your database
```

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