# Charlieverse - Full-Stack Web Application

## Overview

Charlieverse is a modern full-stack web application built with React, Express, and PostgreSQL. It's a tech services company website featuring authentication, user management, and a comprehensive service showcase. The application uses TypeScript throughout and follows modern development practices with a clean separation between frontend and backend.

## System Architecture

The application follows a three-tier architecture:

### Frontend (Client)
- **Technology**: React 18 with TypeScript and Vite
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context for authentication, TanStack Query for server state
- **Authentication**: Firebase Auth integration
- **Build Tool**: Vite with custom configuration for development and production

### Backend (Server)
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple
- **Development**: Hot reload with tsx

### Database
- **Primary Storage**: Firebase-managed user authentication
- **Storage Layer**: Interface-based storage with full CRUD operations for projects
- **Data Persistence**: User data managed by Firebase, projects in-memory for development
- **Schema**: TypeScript interfaces for type safety

## Key Components

### Authentication System
- **Frontend**: Firebase Authentication exclusively with React Context
- **Backend**: Express session management with Firebase sync
- **User Management**: Firebase user management with backend sync
- **Security**: Firebase handles authentication, backend manages sessions and roles
- **Admin Setup**: admin@charlieverse.com automatically becomes admin on first login

### Frontend Architecture
- **Component Structure**: Modular React components with TypeScript
- **Routing**: Single-page application with hash-based navigation
- **State Management**: Context API for global state, component state for local UI
- **Styling**: Utility-first CSS with Tailwind and custom CSS variables

### Backend Architecture
- **API Design**: RESTful endpoints with Express router
- **Error Handling**: Centralized error middleware
- **Logging**: Custom request/response logging middleware
- **Storage Layer**: Abstract interface allowing multiple implementations

### Development Environment
- **Hot Reload**: Vite dev server with backend proxy
- **TypeScript**: Strict type checking across frontend and backend
- **Build Process**: Separate build commands for client and server
- **Development Tools**: Replit integration with custom workflows

## Data Flow

1. **Client Requests**: Frontend makes API calls to Express backend
2. **Authentication**: Firebase handles auth on frontend, Express manages sessions
3. **Database Operations**: Drizzle ORM provides type-safe database access
4. **Response Flow**: Backend returns JSON responses, frontend updates UI reactively
5. **State Management**: TanStack Query caches server state, Context manages auth state

## External Dependencies

### Primary Services
- **Firebase**: Authentication provider for user management
- **Neon Database**: Serverless PostgreSQL hosting
- **Vercel/Replit**: Deployment platform with auto-scaling

### Key Libraries
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query
- **Backend**: Express, Drizzle ORM, connect-pg-simple
- **Development**: Vite, tsx, Drizzle Kit
- **UI Components**: Radix UI primitives with custom styling

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 and PostgreSQL 16 modules
- **Process**: `npm run dev` starts both frontend and backend in development mode
- **Hot Reload**: Vite handles frontend changes, tsx handles backend changes
- **Port Configuration**: Backend on port 5000, frontend proxied through Vite

### Production Deployment
- **Build Process**: `npm run build` creates optimized client and server bundles
- **Server**: ESBuild bundles server code with external packages
- **Client**: Vite builds optimized React application
- **Runtime**: `npm run start` serves production application
- **Scaling**: Autoscale deployment target configured

### Database Management
- **Development**: Local PostgreSQL or Neon serverless
- **Schema Management**: Drizzle migrations with `npm run db:push`
- **Environment Variables**: DATABASE_URL required for database connection

## Recent Changes

✓ Configured Firebase authentication with provided credentials
✓ Completely removed local authentication system and user storage
✓ Set up exclusive Firebase authentication for all users
✓ Admin account: admin@charlieverse.com will have admin privileges automatically
✓ Successfully implemented all future enhancement features:
  - Real-time notifications using WebSockets and Socket.IO
  - File upload system with cloud storage capabilities
  - Advanced analytics dashboard with interactive charts
  - Email notification service with transactional templates
  - Mobile-responsive design enhancements across all components
✓ Successfully migrated project from Replit Agent to Replit environment
✓ Migrated authentication system to use Firebase exclusively
✓ Removed local database password validation and implemented Firebase login
✓ Configured Firebase credentials and authentication flow
✓ Set up admin account: admin@charlieverse.com with Firebase authentication
✓ Migrated authentication system to Firebase exclusively
✓ Removed local database password validation
✓ Updated login/signup to use Firebase authentication
✓ Configured Firebase credentials and connected successfully
✓ Set up admin access for Firebase accounts
✓ Simplified storage to use in-memory data for easy setup and development
✓ Created separate AdminPanel and UserPanel with role-based access control
✓ Built complete UI component library (Button, Card, Badge, Input, Label, Textarea)
✓ Implemented user authentication with admin/user role separation
✓ Added project management system with quote requests and status tracking
✓ Fixed all TypeScript errors and component compatibility issues
✓ Application running successfully with no database dependencies
✓ Complete admin dashboard for user and project management
✓ User dashboard for project requests and profile management
✓ Implemented comprehensive dark/light/system theme system
✓ Added smooth animations for theme transitions
✓ Applied theme variables across all components and panels
✓ Fixed admin login functionality - working correctly
✓ Integrated Firebase authentication for user accounts
✓ Set up Firebase sync with backend database
✓ Updated admin credentials and user management system
✓ Added scroll animations and enhanced background styling to all panels
✓ Fixed component syntax errors and runtime issues
✓ Implemented enhanced project timeline visualization with interactive milestones
✓ Added advanced search and filtering system for projects and users
✓ Created bulk operations interface for admin management tasks
✓ Improved mobile responsiveness across all dashboard components
✓ Enhanced UI/UX with better card layouts and hover effects

## Changelog

```
Changelog:
- January 2025: Project migrated from Bolt to Replit
- June 25, 2025: Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```