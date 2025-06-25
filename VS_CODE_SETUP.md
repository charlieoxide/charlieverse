# Complete VS Code Setup Guide for Charlieverse

## 1. Prerequisites Installation

### Node.js
```bash
# Download from https://nodejs.org (version 18 or higher)
# Or use package managers:

# Windows (Chocolatey)
choco install nodejs

# macOS (Homebrew)  
brew install node

# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### VS Code Extensions
Install these recommended extensions:
- ES7+ React/Redux/React-Native snippets
- TypeScript Hero
- Tailwind CSS IntelliSense
- PostgreSQL (by Chris Kolkman)
- Thunder Client (for API testing)
- Prettier - Code formatter
- ESLint

## 2. Database Setup Options

### Option A: Neon (Free Cloud PostgreSQL - Recommended)

1. Visit https://neon.tech
2. Create a free account
3. Create new project
4. Copy the connection string from dashboard
5. It will look like: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`

### Option B: Local PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# During installation, remember the password for 'postgres' user

# After installation, open Command Prompt as Administrator:
psql -U postgres
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql

# Create database
psql postgres
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user and open psql
sudo -u postgres psql
```

**Create Database (for local setup):**
```sql
CREATE DATABASE charlieverse;
CREATE USER charlieverse_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE charlieverse TO charlieverse_user;
\q
```

### Option C: Docker (Quick Local Setup)

Create `docker-compose.dev.yml`:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: charlieverse
      POSTGRES_USER: charlieverse_user
      POSTGRES_PASSWORD: secure_password_123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run: `docker-compose -f docker-compose.dev.yml up -d`

## 3. Project Setup

### Clone and Install
```bash
# Navigate to your projects folder
cd /path/to/your/projects

# Clone or download the project
# If you have the code, copy it to a new folder

# Navigate to project folder
cd charlieverse

# Install all dependencies
npm install
```

### Environment Configuration
Create `.env` file in the project root:

```env
# Database URL (choose one based on your setup above)

# Option A: Neon Cloud
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# Option B: Local PostgreSQL
DATABASE_URL=postgresql://charlieverse_user:secure_password_123@localhost:5432/charlieverse

# Option C: Docker
DATABASE_URL=postgresql://charlieverse_user:secure_password_123@localhost:5432/charlieverse

# Session Secret (generate a random 32+ character string)
SESSION_SECRET=your_very_secure_random_session_secret_at_least_32_characters_long

# Optional: If you want to use Firebase authentication
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Initialize Database
```bash
# Push the database schema to your PostgreSQL database
npm run db:push
```

## 4. Development Workflow

### Start Development Server
```bash
# This starts both frontend and backend
npm run dev
```

The application will be available at: http://localhost:5000

### VS Code Configuration

Create `.vscode/settings.json` in your project:
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

Create `.vscode/launch.json` for debugging:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "runtimeArgs": ["--loader", "tsx/esm"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "sourceMaps": true
    }
  ]
}
```

## 5. Testing Your Setup

### Database Connection Test
```bash
# Test database connection
node -e "
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
sql\`SELECT NOW() as current_time\`
  .then(result => console.log('Database connected:', result))
  .catch(err => console.error('Database error:', err));
"
```

### API Testing
Use Thunder Client extension or curl:

```bash
# Check if server is running
curl http://localhost:5000/api/auth/me

# Should return: {"message":"Not authenticated"} (this is normal)
```

### Frontend Testing
1. Open http://localhost:5000 in your browser
2. You should see the Charlieverse homepage
3. Try registering a new user
4. Login with admin credentials: admin@charlieverse.com / admin123

## 6. Project Structure Overview

```
charlieverse/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # All React components
│   │   ├── context/       # Authentication context
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # React entry point
│   ├── index.html         # HTML template
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── database.ts        # Database connection
│   ├── storage.ts         # Data access layer
│   ├── routes.ts          # API routes
│   ├── index.ts           # Server entry point
│   └── vite.ts            # Vite integration
├── shared/                # Shared between client/server
│   └── schema.ts          # Database schema and types
├── package.json           # Main dependencies
├── drizzle.config.ts      # Database configuration
├── vite.config.ts         # Frontend build config
├── tailwind.config.ts     # Tailwind CSS config
└── .env                   # Environment variables
```

## 7. Available Scripts

```bash
npm run dev          # Start development server (frontend + backend)
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push database schema changes
npm run check        # TypeScript type checking
```

## 8. Common Development Tasks

### Adding New Features
1. Backend: Add routes in `server/routes.ts`
2. Database: Update schema in `shared/schema.ts`, then run `npm run db:push`
3. Frontend: Create components in `client/src/components/`

### Debugging
- Use VS Code debugger with the launch configuration
- Check browser console for frontend errors
- Check terminal output for backend errors
- Use Thunder Client to test API endpoints

### Database Management
```bash
# View database schema visually
npx drizzle-kit studio

# Reset database (careful - this deletes all data)
# Drop all tables in your database, then:
npm run db:push
```

## 9. Deployment Preparation

### Environment Variables for Production
```env
DATABASE_URL=your_production_database_url
SESSION_SECRET=your_production_session_secret
NODE_ENV=production
```

### Build for Production
```bash
npm run build
```

This creates optimized files ready for deployment.

## 10. Troubleshooting

### Common Issues

**Port 5000 already in use:**
```bash
# Find process using port 5000
lsof -i :5000              # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>              # macOS/Linux
taskkill /PID <PID> /F     # Windows
```

**Database connection errors:**
- Verify DATABASE_URL is correct
- Check if PostgreSQL is running
- Test connection string manually
- Ensure database exists

**TypeScript errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
- Check all environment variables are set
- Ensure all dependencies are installed
- Run `npm run check` to see TypeScript errors

### Getting Help
1. Check the terminal output for specific error messages
2. Look at browser developer console
3. Verify all environment variables are set correctly
4. Test database connection separately

## Success Indicators

✅ `npm run dev` starts without errors
✅ http://localhost:5000 loads the homepage
✅ Can register a new user
✅ Can login with admin@charlieverse.com / admin123
✅ Database operations work (user registration creates entries)
✅ No TypeScript errors when running `npm run check`

Your Charlieverse application is now ready for development in VS Code!