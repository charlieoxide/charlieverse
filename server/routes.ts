import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import connectDB from "./database";
import WebSocketManager from './websocket.js';
import { upload, processImage, validateFile, getFileInfo, getFileCategory, type FileMetadata } from './fileUpload.js';
import { AnalyticsService } from './analytics.js';
import emailService from './email.js';
import path from 'path';

// Session middleware setup
declare module "express-session" {
  interface SessionData {
    userId?: string;
    userEmail?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }
}

// Authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.session.userId || req.session.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);
  
  // Initialize WebSocket manager
  const wsManager = new WebSocketManager(server);
  
  // Initialize analytics service
  const analyticsService = new AnalyticsService(storage);

  // Try to connect to PostgreSQL
  const dbConnected = await connectDB();
  
  // Create admin user if it doesn't exist
  if (dbConnected) {
    const { createAdminUser } = await import('./seedAdmin');
    setTimeout(() => createAdminUser(), 2000);
  } else {
    console.log('Database connection failed - please check DATABASE_URL');
  }

  // Firebase sync route
  app.post('/api/auth/sync-firebase', async (req, res) => {
    try {
      const { firebaseUid, email, displayName } = req.body;
      
      // Check if user already exists
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create new user from Firebase data
        const nameParts = displayName ? displayName.split(' ') : ['', ''];
        // Check if this is the first user or specific admin email - make them admin
        const isFirstUser = (await storage.getAllUsers()).length === 0;
        const isAdminEmail = email === 'admin@charlieverse.com' || email === 'crbond777@gmail.com';
        
        user = await storage.createUser({
          email,
          password: '', // Firebase handles auth, no local password needed
          firstName: nameParts[0] || 'User',
          lastName: nameParts[1] || '',
          firebaseUid,
          role: (isFirstUser || isAdminEmail) ? 'admin' : 'user'
        });
      }

      // Create session
      req.session.userId = user.id.toString();
      req.session.userEmail = user.email;
      req.session.firstName = user.firstName;
      req.session.lastName = user.lastName;
      req.session.role = user.role;

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Firebase sync error:', error);
      res.status(400).json({ message: 'Firebase sync failed' });
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, firstName, lastName, phone, company, bio, firebaseUid } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Create user with Firebase UID
      const user = await storage.createUser({
        email,
        password: '', // Firebase handles authentication
        firstName,
        lastName,
        phone,
        company,
        bio,
        firebaseUid
      });
      
      // Set session
      req.session.userId = user.id.toString();
      req.session.userEmail = user.email;
      req.session.firstName = user.firstName;
      req.session.lastName = user.lastName;
      req.session.role = user.role;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { firebaseUid, email, displayName, idToken, directAuth, password } = req.body;
      
      if (directAuth) {
        // Direct authentication fallback
        if (!email || !password) {
          return res.status(400).json({ message: "Email and password required" });
        }
        
        // Simple authentication for demo purposes
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }
        
        // For demo purposes, accept the admin credentials
        if (email === 'admin@charlieverse.com' && password === 'admin123') {
          // Set session
          req.session.userId = user.id.toString();
          req.session.userEmail = user.email;
          req.session.firstName = user.firstName;
          req.session.lastName = user.lastName;
          req.session.role = user.role;
          
          const { password: _, ...userWithoutPassword } = user;
          return res.json({ user: userWithoutPassword });
        } else {
          return res.status(400).json({ message: "Invalid credentials" });
        }
      } else {
        // Firebase authentication path
        if (!firebaseUid || !email) {
          return res.status(400).json({ message: "Firebase authentication required" });
        }
        
        // Check if user exists, create if not
        let user = await storage.getUserByEmail(email);
        
        if (!user) {
          // Create new user from Firebase data
          const nameParts = displayName ? displayName.split(' ') : ['', ''];
          // Check if this is an admin email
          const isAdminEmail = email === 'admin@charlieverse.com';
          
          user = await storage.createUser({
            email,
            password: '', // Firebase handles auth, no local password needed
            firstName: nameParts[0] || 'User',
            lastName: nameParts[1] || '',
            firebaseUid,
            role: isAdminEmail ? 'admin' : 'user'
          });
        }

        // Set session
        req.session.userId = user.id.toString();
        req.session.userEmail = user.email;
        req.session.firstName = user.firstName;
        req.session.lastName = user.lastName;
        req.session.role = user.role;
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Authentication failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.session.userId!));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Admin route to upgrade user to admin
  app.post("/api/auth/make-admin", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (email === 'crbond777@gmail.com') {
        const user = await storage.getUserByEmail(email);
        if (user) {
          const updatedUser = await storage.updateUser(user.id, { role: 'admin' });
          res.json({ message: 'User upgraded to admin', user: updatedUser });
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } else {
        res.status(403).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error('Admin upgrade error:', error);
      res.status(500).json({ message: 'Failed to upgrade user' });
    }
  });

  // User profile routes
  app.put("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const { firstName, lastName, phone, company, bio } = req.body;
      const user = await storage.updateUser(parseInt(req.session.userId!), {
        firstName,
        lastName,
        phone,
        company,
        bio
      });
      
      res.json(user);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  // Project routes
  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const { title, description, projectType, budget, timeline, contactMethod } = req.body;
      const project = await storage.createProject({
        userId: req.session.userId!,
        title,
        description,
        projectType,
        budget,
        timeline,
        contactMethod
      });
      
      // Notify admins of new project
      wsManager.sendUserAction('project_created', req.session.userId!, {
        projectId: project.id,
        title: project.title,
        type: project.projectType,
        budget: project.budget
      });
      
      // Send email notification to admins
      if (emailService.isEmailServiceConfigured()) {
        const user = await storage.getUserByEmail(req.session.userEmail!);
        if (user) {
          await emailService.sendNewProjectNotification('admin@charlieverse.com', project, user);
        }
      }
      
      res.json(project);
    } catch (error) {
      console.error("Create project error:", error);
      res.status(400).json({ message: "Failed to create project" });
    }
  });

  app.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const projects = await storage.getProjectsByUser(req.session.userId!);
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  app.get("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check if user owns the project or is admin
      if (project.userId._id.toString() !== req.session.userId && req.session.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ message: "Failed to get project" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", requireAuth, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  app.get("/api/admin/projects", requireAuth, requireAdmin, async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Get all projects error:", error);
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  app.patch('/api/admin/projects/:id/status', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, message } = req.body;
      const project = await storage.updateProjectStatus(parseInt(id), status);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Send real-time notification to project owner
      wsManager.sendProjectUpdate(id, project.userId.toString(), { 
        title: project.title, 
        status,
        message: message || `Project status updated to ${status}`
      });
      
      // Send email notification to project owner
      if (emailService.isEmailServiceConfigured()) {
        const user = await storage.getUserByEmail(project.userId.email);
        if (user) {
          await emailService.sendProjectStatusUpdate(user, project, status, message || `Your project status has been updated to ${status}`);
        }
      }
      
      res.json(project);
    } catch (error) {
      console.error('Error updating project status:', error);
      res.status(500).json({ message: 'Failed to update project status' });
    }
  });

  app.patch('/api/admin/users/:id/status', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const user = await storage.updateUser(parseInt(id), { isActive });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ message: 'Failed to update user status' });
    }
  });

  app.put("/api/admin/projects/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status, estimatedCost, actualCost, startDate, endDate } = req.body;
      
      const updates: any = {};
      if (estimatedCost !== undefined) updates.estimatedCost = estimatedCost;
      if (actualCost !== undefined) updates.actualCost = actualCost;
      if (startDate) updates.startDate = new Date(startDate);
      if (endDate) updates.endDate = new Date(endDate);
      
      const project = await storage.updateProjectStatus(req.params.id, status, updates);
      res.json(project);
    } catch (error) {
      console.error("Update project status error:", error);
      res.status(400).json({ message: "Failed to update project status" });
    }
  });

  app.post("/api/admin/projects/:id/updates", requireAdmin, async (req, res) => {
    try {
      const { title, description, status } = req.body;
      
      const update = await storage.addProjectUpdate({
        projectId: req.params.id,
        userId: req.session.userId!,
        title,
        description,
        status,
      });
      
      res.json(update);
    } catch (error) {
      console.error("Add project update error:", error);
      res.status(400).json({ message: "Failed to add project update" });
    }
  });

  app.get("/api/projects/:id/updates", requireAuth, async (req, res) => {
    try {
      const updates = await storage.getProjectUpdates(req.params.id);
      res.json(updates);
    } catch (error) {
      console.error("Get project updates error:", error);
      res.status(500).json({ message: "Failed to get project updates" });
    }
  });

  // Enhanced Features - File Upload Routes
  app.post('/api/files/upload', requireAuth, upload.array('files', 5), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const fileMetadata: FileMetadata[] = [];
      
      for (const file of req.files) {
        const validation = validateFile(file);
        if (!validation.valid) {
          return res.status(400).json({ message: validation.error });
        }

        const metadata: FileMetadata = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          originalName: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          category: getFileCategory(file.mimetype),
          uploadedBy: req.session.userId!,
          uploadedAt: new Date(),
          projectId: req.body.projectId,
          description: req.body.description
        };

        fileMetadata.push(metadata);

        // Process images
        if (file.mimetype.startsWith('image/')) {
          try {
            await processImage(file.path);
          } catch (error) {
            console.error('Image processing error:', error);
          }
        }
      }

      // Notify admins of file upload
      wsManager.sendUserAction('file_upload', req.session.userId!, {
        fileCount: fileMetadata.length,
        projectId: req.body.projectId
      });

      res.json({ files: fileMetadata });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ message: 'File upload failed' });
    }
  });

  app.get('/api/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), 'uploads', filename);
    res.sendFile(filePath);
  });

  app.get('/api/files/:filename/info', async (req, res) => {
    try {
      const info = await getFileInfo(req.params.filename);
      res.json(info);
    } catch (error) {
      res.status(404).json({ message: 'File not found' });
    }
  });

  // Analytics Routes
  app.get('/api/analytics/dashboard', requireAuth, requireAdmin, async (req, res) => {
    try {
      const analytics = await analyticsService.getAnalyticsData();
      res.json(analytics);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ message: 'Failed to get analytics data' });
    }
  });

  app.get('/api/analytics/projects/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const analytics = await analyticsService.getProjectAnalytics(req.params.id);
      if (!analytics) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json(analytics);
    } catch (error) {
      console.error('Project analytics error:', error);
      res.status(500).json({ message: 'Failed to get project analytics' });
    }
  });

  // Email Configuration Routes
  app.get('/api/email/status', requireAuth, requireAdmin, (req, res) => {
    res.json({ 
      configured: emailService.isEmailServiceConfigured(),
      message: emailService.isEmailServiceConfigured() 
        ? 'Email service is configured and ready'
        : 'Email service not configured - add SMTP credentials to environment variables'
    });
  });

  app.post('/api/email/test', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { to, subject, message } = req.body;
      const success = await emailService.sendEmail({
        to,
        subject: subject || 'Test Email from Charlieverse',
        html: `<p>${message || 'This is a test email from your Charlieverse application.'}</p>`,
        text: message || 'This is a test email from your Charlieverse application.'
      });

      res.json({ 
        success,
        message: success ? 'Test email sent successfully' : 'Failed to send test email'
      });
    } catch (error) {
      console.error('Test email error:', error);
      res.status(500).json({ message: 'Failed to send test email' });
    }
  });

  // WebSocket Status Route
  app.get('/api/websocket/status', requireAuth, requireAdmin, (req, res) => {
    res.json({
      connectedUsers: wsManager.getConnectedUsersCount(),
      isUserOnline: (userId: string) => wsManager.isUserOnline(userId)
    });
  });

  // Real-time notification routes
  app.post('/api/notifications/send', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { type, title, message, userId, broadcast } = req.body;
      
      const notification = {
        type: type || 'system_alert',
        title,
        message,
        timestamp: new Date(),
        data: req.body.data
      };

      if (broadcast) {
        wsManager.broadcast(notification);
      } else if (userId) {
        wsManager.sendToUser(userId, notification);
      } else {
        wsManager.sendToAdmins(notification);
      }

      res.json({ success: true, message: 'Notification sent' });
    } catch (error) {
      console.error('Notification send error:', error);
      res.status(500).json({ message: 'Failed to send notification' });
    }
  });

  return server;
}
