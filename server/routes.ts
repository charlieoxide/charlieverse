import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import connectDB from "./database";

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
      const { firebaseUid, email, displayName, idToken } = req.body;
      
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
    } catch (error) {
      console.error("Firebase login error:", error);
      res.status(400).json({ message: "Firebase authentication failed" });
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
      const { status } = req.body;
      const project = await storage.updateProjectStatus(parseInt(id), status);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
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

  const httpServer = createServer(app);
  return httpServer;
}
