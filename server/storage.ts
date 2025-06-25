import { User, Project, ProjectUpdate } from './database';
import mongoose from 'mongoose';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  createUser(user: any): Promise<any>;
  updateUser(id: string, updates: any): Promise<any>;
  getAllUsers(): Promise<any[]>;
  
  // Project operations
  createProject(project: any): Promise<any>;
  getProjectsByUser(userId: string): Promise<any[]>;
  getAllProjects(): Promise<any[]>;
  getProject(id: string): Promise<any>;
  updateProjectStatus(id: string, status: string, updates?: any): Promise<any>;
  
  // Project updates
  addProjectUpdate(update: any): Promise<any>;
  getProjectUpdates(projectId: string): Promise<any[]>;
}

export class MongoStorage implements IStorage {
  private fallbackStorage = new Map<string, any>();
  private projectStorage = new Map<string, any>();
  private userIdCounter = 1;
  private projectIdCounter = 1;
  private isMongoConnected = false;

  constructor() {
    // Check MongoDB connection status
    setTimeout(() => {
      this.isMongoConnected = mongoose.connection.readyState === 1;
    }, 2000);
  }

  // User operations
  async getUser(id: string) {
    try {
      if (mongoose.connection.readyState === 1) {
        return await User.findById(id).select('-password');
      }
      return this.fallbackStorage.get(id);
    } catch (error) {
      return this.fallbackStorage.get(id);
    }
  }

  async getUserByEmail(email: string) {
    try {
      if (mongoose.connection.readyState === 1) {
        return await User.findOne({ email });
      }
      const users = Array.from(this.fallbackStorage.values());
      for (const user of users) {
        if (user.email === email) return user;
      }
      return null;
    } catch (error) {
      const users = Array.from(this.fallbackStorage.values());
      for (const user of users) {
        if (user.email === email) return user;
      }
      return null;
    }
  }

  async createUser(userData: any) {
    try {
      if (mongoose.connection.readyState === 1) {
        const user = new User(userData);
        return await user.save();
      }
      const user = {
        _id: (this.userIdCounter++).toString(),
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.fallbackStorage.set(user._id, user);
      return user;
    } catch (error) {
      const user = {
        _id: (this.userIdCounter++).toString(),
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.fallbackStorage.set(user._id, user);
      return user;
    }
  }

  async updateUser(id: string, updates: any) {
    try {
      if (mongoose.connection.readyState === 1) {
        return await User.findByIdAndUpdate(
          id, 
          { ...updates, updatedAt: new Date() }, 
          { new: true }
        ).select('-password');
      }
      const user = this.fallbackStorage.get(id);
      if (user) {
        const updated = { ...user, ...updates, updatedAt: new Date() };
        this.fallbackStorage.set(id, updated);
        const { password, ...userWithoutPassword } = updated;
        return userWithoutPassword;
      }
      return null;
    } catch (error) {
      const user = this.fallbackStorage.get(id);
      if (user) {
        const updated = { ...user, ...updates, updatedAt: new Date() };
        this.fallbackStorage.set(id, updated);
        const { password, ...userWithoutPassword } = updated;
        return userWithoutPassword;
      }
      return null;
    }
  }

  async getAllUsers() {
    try {
      if (mongoose.connection.readyState === 1) {
        return await User.find().select('-password').sort({ createdAt: -1 });
      }
      return Array.from(this.fallbackStorage.values()).map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      return Array.from(this.fallbackStorage.values()).map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    }
  }

  // Project operations
  async createProject(projectData: any) {
    try {
      const project = new Project(projectData);
      return await project.save();
    } catch (error) {
      const project = {
        _id: (this.projectIdCounter++).toString(),
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.projectStorage.set(project._id, project);
      return project;
    }
  }

  async getProjectsByUser(userId: string) {
    try {
      return await Project.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      return Array.from(this.projectStorage.values())
        .filter(project => project.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  async getAllProjects() {
    try {
      return await Project.find()
        .populate('userId', '-password')
        .sort({ createdAt: -1 });
    } catch (error) {
      return Array.from(this.projectStorage.values()).map(project => ({
        ...project,
        userId: this.fallbackStorage.get(project.userId) || { _id: project.userId, email: 'unknown' }
      }));
    }
  }

  async getProject(id: string) {
    try {
      return await Project.findById(id).populate('userId', '-password');
    } catch (error) {
      const project = this.projectStorage.get(id);
      if (project) {
        return {
          ...project,
          userId: this.fallbackStorage.get(project.userId) || { _id: project.userId, email: 'unknown' }
        };
      }
      return null;
    }
  }

  async updateProjectStatus(id: string, status: string, updates: any = {}) {
    try {
      const updateData = {
        status,
        ...updates,
        updatedAt: new Date(),
      };
      
      if (status === 'completed') {
        updateData.completedAt = new Date();
      }
      
      return await Project.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      const project = this.projectStorage.get(id);
      if (project) {
        const updated = {
          ...project,
          status,
          ...updates,
          updatedAt: new Date(),
          ...(status === 'completed' && { completedAt: new Date() })
        };
        this.projectStorage.set(id, updated);
        return updated;
      }
      return null;
    }
  }

  // Project updates
  async addProjectUpdate(updateData: any) {
    try {
      const update = new ProjectUpdate(updateData);
      return await update.save();
    } catch (error) {
      // Fallback for project updates
      return { _id: Date.now().toString(), ...updateData, createdAt: new Date() };
    }
  }

  async getProjectUpdates(projectId: string) {
    try {
      return await ProjectUpdate.find({ projectId })
        .populate('userId', '-password')
        .sort({ createdAt: -1 });
    } catch (error) {
      return [];
    }
  }
}

export const storage = new MongoStorage();
