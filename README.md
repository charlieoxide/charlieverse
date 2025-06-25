# Charlieverse - Full-Stack Web Application

A modern full-stack web application built with React, Express, and Firebase authentication. Features a comprehensive tech services showcase with user management, project requests, and real-time notifications.

## 🚀 Features

- **Firebase Authentication**: Secure user authentication and registration
- **Admin Dashboard**: Complete user and project management system
- **User Portal**: Project request and management interface
- **Real-time Notifications**: WebSocket-powered notifications
- **File Upload System**: Secure file upload with image processing
- **Analytics Dashboard**: Interactive charts and metrics
- **Email Notifications**: Transactional email system
- **Mobile Responsive**: Optimized for all device sizes
- **Dark/Light Theme**: System and manual theme switching

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** with shadcn/ui components
- **Firebase Auth** for authentication
- **Socket.IO** for real-time features
- **Recharts** for analytics visualization

### Backend
- **Node.js** with Express
- **TypeScript** throughout
- **WebSocket** support with Socket.IO
- **File Upload** with Multer and Sharp
- **Email Service** with Nodemailer/SendGrid
- **Session Management** with PostgreSQL store

### Database & Storage
- **In-memory storage** for development
- **Firebase** for user authentication
- **File system** for uploads
- **PostgreSQL** support (optional)

## 📋 Prerequisites

- Node.js 18+ 
- Firebase project with Authentication enabled
- SMTP credentials for email (optional)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd charlieverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Update `client/src/firebase.ts` with your Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.firebasestorage.app",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Enable Firebase Authentication**
   - Go to Firebase Console
   - Enable Email/Password authentication
   - Add your domain to authorized domains

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
This starts both the Express server (port 5000) and Vite dev server with hot reload.

### Production Build
```bash
npm run build
npm start
```

## 👤 Admin Access

Create an admin account using Firebase Authentication with:
- **Email**: admin@charlieverse.com
- **Password**: admin123

The admin email automatically receives admin privileges.

## 📁 Project Structure

```
charlieverse/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── context/        # React contexts
│   │   ├── firebase.ts     # Firebase configuration
│   │   └── ...
├── server/                 # Express backend
│   ├── analytics.ts        # Analytics service
│   ├── email.ts           # Email service
│   ├── fileUpload.ts      # File upload handling
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   ├── websocket.ts       # WebSocket server
│   └── ...
├── shared/                # Shared types and schemas
└── ...
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/sync-firebase` - Sync Firebase user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create project request
- `PATCH /api/admin/projects/:id/status` - Update project status (admin)

### File Upload
- `POST /api/files/upload` - Upload files
- `GET /api/files/:filename` - Serve uploaded files

### Analytics
- `GET /api/analytics/dashboard` - Get analytics data (admin)
- `GET /api/analytics/projects/:id` - Get project analytics (admin)

## 🎨 UI Components

Built with shadcn/ui components including:
- Responsive navigation and header
- Dark/light theme toggle
- Interactive dashboards
- File upload with drag & drop
- Real-time notification system
- Analytics charts and metrics

## 🔄 Real-time Features

- **WebSocket Notifications**: Instant updates for project changes
- **Admin Alerts**: Real-time user activity notifications
- **Project Updates**: Live status change notifications
- **File Upload Progress**: Real-time upload feedback

## 📧 Email Notifications

Automated emails for:
- Welcome messages for new users
- Project status updates
- Admin notifications for new projects
- System alerts and updates

## 📱 Mobile Responsive

Fully responsive design with:
- Mobile-first approach
- Touch-friendly interfaces
- Optimized layouts for all screen sizes
- Progressive web app features

## 🔒 Security Features

- **Firebase Authentication**: Secure user management
- **Session Management**: Express sessions with CSRF protection
- **File Validation**: Secure file upload with type checking
- **Role-based Access**: Admin and user role separation
- **Input Sanitization**: XSS and injection protection

## 🚀 Deployment

The application is configured for deployment on:
- **Replit**: Native support with workflows
- **Vercel**: Frontend deployment
- **Railway/Render**: Full-stack deployment
- **Firebase Hosting**: Static hosting option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: admin@charlieverse.com

---

Built with ❤️ using modern web technologies