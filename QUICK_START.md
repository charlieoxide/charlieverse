# Quick Start Guide - 2 Minutes Setup

## 1. Install Dependencies
```bash
npm install
```

## 2. Environment Setup (Optional)
Create `.env` file in project root:

```env
# Generate a secure random string (32+ characters)
SESSION_SECRET=your_very_secure_session_secret_minimum_32_characters_long
```

## 3. Start Development Server
```bash
npm run dev
```

## 4. Open Application
- Open http://localhost:5000
- Default admin: admin@charlieverse.com / admin123

## That's it!

Your application is now running with in-memory storage. No database setup required! Data will reset when server restarts, perfect for development and testing.