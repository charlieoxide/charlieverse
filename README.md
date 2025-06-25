# Charlieverse - Full-Stack Web Application

A modern tech services company website built with React, Express, and PostgreSQL.

## Features

- **Authentication System**: Complete user registration, login, and session management
- **User Profiles**: Personal dashboards with quote request functionality
- **Admin Dashboard**: User and project management for administrators
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components
- **Type-Safe**: Full TypeScript implementation across frontend and backend
- **Database**: PostgreSQL with Drizzle ORM and intelligent fallback storage

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (local or cloud)

### Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and session secret

# Initialize database
npm run db:push

# Start development server
npm run dev
```

Open http://localhost:5000

### Default Admin
- Email: admin@charlieverse.com
- Password: admin123

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Authentication context
│   │   └── main.tsx       # Entry point
├── server/                # Express backend
│   ├── database.ts        # Database connection
│   ├── storage.ts         # Data access layer
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema
└── package.json           # Dependencies
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes

### Environment Variables
```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your_secure_session_secret
```

## Deployment

The application is configured for Replit deployment with automatic scaling. For other platforms:

1. Build the application: `npm run build`
2. Set environment variables
3. Start with: `npm run start`

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, TypeScript, Node.js
- **Database**: PostgreSQL, Drizzle ORM
- **UI Components**: Radix UI, shadcn/ui
- **Authentication**: Session-based with bcrypt

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md) or [QUICK_START.md](./QUICK_START.md).