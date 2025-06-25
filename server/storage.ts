import { db, useDatabase } from './database';
import { users, projects, projectUpdates } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';
import type { InsertUser, User, InsertProject, Project, ProjectUpdate, UpdateUser } from '../shared/schema';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: UpdateUser): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  
  // Project operations
  createProject(project: InsertProject & { userId: number }): Promise<Project>;
  getProjectsByUser(userId: number): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | null>;
  updateProjectStatus(id: number, status: string, updates?: any): Promise<Project | null>;
  
  // Project updates
  addProjectUpdate(update: any): Promise<ProjectUpdate>;
  getProjectUpdates(projectId: number): Promise<ProjectUpdate[]>;
}

export class PostgreSQLStorage implements IStorage {
  private fallbackUsers = new Map<number, User>();
  private fallbackProjects = new Map<number, Project>();
  private fallbackUpdates = new Map<number, ProjectUpdate>();
  private userIdCounter = 1;
  private projectIdCounter = 1;
  private updateIdCounter = 1;

  constructor() {
    // Create default admin user
    this.initializeDefaultAdmin();
  }

  private async initializeDefaultAdmin() {
    try {
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser: User = {
        id: this.userIdCounter++,
        email: 'admin@charlieverse.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: null,
        role: 'admin',
        profilePicture: null,
        bio: 'System Administrator',
        company: 'Charlieverse',
        firebaseUid: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.fallbackUsers.set(adminUser.id, adminUser);
      console.log('Default admin user created: admin@charlieverse.com / admin123');
    } catch (error) {
      console.error('Error creating default admin:', error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | null> {
    if (!useDatabase) {
      return this.fallbackUsers.get(id) || null;
    }
    
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return this.fallbackUsers.get(id) || null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!useDatabase) {
      const userArray = Array.from(this.fallbackUsers.values());
      const user = userArray.find(u => u.email === email);
      return user || null;
    }
    
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      const userArray = Array.from(this.fallbackUsers.values());
      const user = userArray.find(u => u.email === email);
      return user || null;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    if (!useDatabase) {
      const user: User = {
        id: this.userIdCounter++,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        phone: userData.phone || null,
        role: 'user',
        profilePicture: null,
        bio: userData.bio || null,
        company: userData.company || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.fallbackUsers.set(user.id, user);
      return user;
    }
    
    try {
      const result = await db.insert(users).values(userData).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      const user: User = {
        id: this.userIdCounter++,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        phone: userData.phone || null,
        role: 'user',
        profilePicture: null,
        bio: userData.bio || null,
        company: userData.company || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.fallbackUsers.set(user.id, user);
      return user;
    }
  }

  async updateUser(id: number, updates: UpdateUser): Promise<User | null> {
    if (!useDatabase) {
      const user = this.fallbackUsers.get(id);
      if (user) {
        const updated = { ...user, ...updates, updatedAt: new Date() };
        this.fallbackUsers.set(id, updated);
        return updated;
      }
      return null;
    }
    
    try {
      const result = await db.update(users)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating user:', error);
      const user = this.fallbackUsers.get(id);
      if (user) {
        const updated = { ...user, ...updates, updatedAt: new Date() };
        this.fallbackUsers.set(id, updated);
        return updated;
      }
      return null;
    }
  }

  async getAllUsers(): Promise<User[]> {
    if (!useDatabase) {
      return Array.from(this.fallbackUsers.values()).sort((a, b) => 
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
    }
    
    try {
      return await db.select().from(users).orderBy(desc(users.createdAt));
    } catch (error) {
      console.error('Error getting all users:', error);
      return Array.from(this.fallbackUsers.values()).sort((a, b) => 
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
    }
  }

  // Project operations
  async createProject(projectData: InsertProject & { userId: number }): Promise<Project> {
    if (!useDatabase) {
      const project: Project = {
        id: this.projectIdCounter++,
        ...projectData,
        status: 'pending',
        priority: 'medium',
        contactMethod: projectData.contactMethod || 'email',
        estimatedCost: null,
        actualCost: null,
        startDate: null,
        endDate: null,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.fallbackProjects.set(project.id, project);
      return project;
    }
    
    try {
      const result = await db.insert(projects).values(projectData).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating project:', error);
      const project: Project = {
        id: this.projectIdCounter++,
        ...projectData,
        status: 'pending',
        priority: 'medium',
        contactMethod: projectData.contactMethod || 'email',
        estimatedCost: null,
        actualCost: null,
        startDate: null,
        endDate: null,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.fallbackProjects.set(project.id, project);
      return project;
    }
  }

  async getProjectsByUser(userId: number): Promise<Project[]> {
    if (!useDatabase) {
      return Array.from(this.fallbackProjects.values())
        .filter(project => project.userId === userId)
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    }
    
    try {
      return await db.select().from(projects)
        .where(eq(projects.userId, userId))
        .orderBy(desc(projects.createdAt));
    } catch (error) {
      console.error('Error getting projects by user:', error);
      return Array.from(this.fallbackProjects.values())
        .filter(project => project.userId === userId)
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    }
  }

  async getAllProjects(): Promise<Project[]> {
    if (!useDatabase) {
      return Array.from(this.fallbackProjects.values())
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    }
    
    try {
      return await db.select().from(projects).orderBy(desc(projects.createdAt));
    } catch (error) {
      console.error('Error getting all projects:', error);
      return Array.from(this.fallbackProjects.values())
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    }
  }

  async getProject(id: number): Promise<Project | null> {
    if (!useDatabase) {
      return this.fallbackProjects.get(id) || null;
    }
    
    try {
      const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error getting project:', error);
      return this.fallbackProjects.get(id) || null;
    }
  }

  async updateProjectStatus(id: number, status: string, updates: any = {}): Promise<Project | null> {
    if (!useDatabase) {
      const project = this.fallbackProjects.get(id);
      if (project) {
        const updated = {
          ...project,
          status,
          ...updates,
          updatedAt: new Date(),
          ...(status === 'completed' && { completedAt: new Date() })
        };
        this.fallbackProjects.set(id, updated);
        return updated;
      }
      return null;
    }
    
    try {
      const updateData = {
        status,
        ...updates,
        updatedAt: new Date(),
        ...(status === 'completed' && { completedAt: new Date() })
      };
      
      const result = await db.update(projects)
        .set(updateData)
        .where(eq(projects.id, id))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating project status:', error);
      const project = this.fallbackProjects.get(id);
      if (project) {
        const updated = {
          ...project,
          status,
          ...updates,
          updatedAt: new Date(),
          ...(status === 'completed' && { completedAt: new Date() })
        };
        this.fallbackProjects.set(id, updated);
        return updated;
      }
      return null;
    }
  }

  // Project updates
  async addProjectUpdate(updateData: any): Promise<ProjectUpdate> {
    if (!useDatabase) {
      const update: ProjectUpdate = {
        id: this.updateIdCounter++,
        ...updateData,
        createdAt: new Date()
      };
      this.fallbackUpdates.set(update.id, update);
      return update;
    }
    
    try {
      const result = await db.insert(projectUpdates).values(updateData).returning();
      return result[0];
    } catch (error) {
      console.error('Error adding project update:', error);
      const update: ProjectUpdate = {
        id: this.updateIdCounter++,
        ...updateData,
        createdAt: new Date()
      };
      this.fallbackUpdates.set(update.id, update);
      return update;
    }
  }

  async getProjectUpdates(projectId: number): Promise<ProjectUpdate[]> {
    if (!useDatabase) {
      return Array.from(this.fallbackUpdates.values())
        .filter(update => update.projectId === projectId)
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    }
    
    try {
      return await db.select().from(projectUpdates)
        .where(eq(projectUpdates.projectId, projectId))
        .orderBy(desc(projectUpdates.createdAt));
    } catch (error) {
      console.error('Error getting project updates:', error);
      return Array.from(this.fallbackUpdates.values())
        .filter(update => update.projectId === projectId)
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    }
  }
}

export const storage = new PostgreSQLStorage();
