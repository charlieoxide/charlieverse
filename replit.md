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
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema management
- **Storage Abstraction**: Interface-based storage layer with in-memory fallback

## Key Components

### Authentication System
- **Frontend**: Firebase Authentication with React Context
- **Backend**: Express session management with PostgreSQL store
- **User Management**: Drizzle schema with user table and validation
- **Security**: Password hashing and session-based authentication

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

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```