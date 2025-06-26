import { 
  User, 
  Project, 
  ProjectUpdate, 
  ContactMessage,
  InsertUser, 
  InsertProject, 
  InsertProjectUpdate,
  InsertContactMessage,
  UpdateUser, 
  UpdateProject,
  users,
  projects,
  projectUpdates,
  contactMessages
} from '../shared/schema';
import { db } from './db';
import { eq, desc } from 'drizzle-orm';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: UpdateUser): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  
  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProjectsByUser(userId: number): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | null>;
  updateProjectStatus(id: number, status: string, updates?: any): Promise<Project | null>;
  
  // Project updates
  addProjectUpdate(update: InsertProjectUpdate): Promise<ProjectUpdate>;
  getProjectUpdates(projectId: number): Promise<ProjectUpdate[]>;
  
  // Contact messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  updateContactMessage(id: number, updates: Partial<ContactMessage>): Promise<ContactMessage | null>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: UpdateUser): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || null;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(projectData)
      .returning();
    return project;
  }

  async getProjectsByUser(userId: number): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | null> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || null;
  }

  async updateProjectStatus(id: number, status: string, updates: any = {}): Promise<Project | null> {
    const [project] = await db
      .update(projects)
      .set({ 
        status, 
        ...updates, 
        updatedAt: new Date() 
      })
      .where(eq(projects.id, id))
      .returning();
    return project || null;
  }

  async addProjectUpdate(updateData: InsertProjectUpdate): Promise<ProjectUpdate> {
    const [update] = await db
      .insert(projectUpdates)
      .values(updateData)
      .returning();
    return update;
  }

  async getProjectUpdates(projectId: number): Promise<ProjectUpdate[]> {
    return await db
      .select()
      .from(projectUpdates)
      .where(eq(projectUpdates.projectId, projectId))
      .orderBy(desc(projectUpdates.createdAt));
  }

  async createContactMessage(messageData: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(messageData)
      .returning();
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async updateContactMessage(id: number, updates: Partial<ContactMessage>): Promise<ContactMessage | null> {
    const [message] = await db
      .update(contactMessages)
      .set(updates)
      .where(eq(contactMessages.id, id))
      .returning();
    return message || null;
  }
}

export const storage = new DatabaseStorage();