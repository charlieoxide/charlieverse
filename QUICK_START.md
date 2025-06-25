# Quick Start Guide - 5 Minutes Setup

## 1. Install Dependencies
```bash
npm install
```

## 2. Set Up Database (Choose One)

### Option A: Free Cloud Database (Easiest)
1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string

### Option B: Local PostgreSQL
```bash
# Install PostgreSQL
# Windows: Download from postgresql.org
# macOS: brew install postgresql
# Linux: sudo apt install postgresql
```

## 3. Environment Setup
Create `.env` file in project root:

```env
# Replace with your actual database URL
DATABASE_URL=postgresql://username:password@host:port/database

# Generate a secure random string (32+ characters)
SESSION_SECRET=your_very_secure_session_secret_minimum_32_characters_long
```

## 4. Initialize Database
```bash
npm run db:push
```

## 5. Start Development Server
```bash
npm run dev
```

## 6. Open Application
- Open http://localhost:5000
- Default admin: admin@charlieverse.com / admin123

## That's it! 🎉

Your application is now running. Check the full SETUP_GUIDE.md for detailed instructions and troubleshooting.