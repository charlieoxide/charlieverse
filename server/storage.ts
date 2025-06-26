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

export class InMemoryStorage implements IStorage {
  private users = new Map<number, User>();
  private projects = new Map<number, Project>();
  private updates = new Map<number, ProjectUpdate>();
  private userIdCounter = 1;
  private projectIdCounter = 1;
  private updateIdCounter = 1;

  constructor() {
    console.log('In-memory storage initialized - no database required');
  }

  // User operations
  async getUser(id: number): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: this.userIdCounter++,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      phone: userData.phone || null,
      role: userData.role || 'user',
      profilePicture: userData.profilePicture || null,
      bio: userData.bio || null,
      company: userData.company || null,
      firebaseUid: userData.firebaseUid || null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: UpdateUser): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Project operations
  async createProject(projectData: InsertProject & { userId: number }): Promise<Project> {
    const project: Project = {
      id: this.projectIdCounter++,
      userId: projectData.userId,
      title: projectData.title,
      description: projectData.description || null,
      projectType: projectData.projectType || null,
      budget: projectData.budget || null,
      timeline: projectData.timeline || null,
      status: projectData.status || 'pending',
      priority: projectData.priority || 'medium',
      contactMethod: projectData.contactMethod || 'email',
      estimatedCost: projectData.estimatedCost || null,
      actualCost: projectData.actualCost || null,
      startDate: projectData.startDate || null,
      endDate: projectData.endDate || null,
      completedAt: projectData.completedAt || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.projects.set(project.id, project);
    return project;
  }

  async getProjectsByUser(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getProject(id: number): Promise<Project | null> {
    return this.projects.get(id) || null;
  }

  async updateProjectStatus(id: number, status: string, updates: any = {}): Promise<Project | null> {
    const project = this.projects.get(id);
    if (!project) return null;
    
    const updatedProject = {
      ...project,
      status,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  // Project updates
  async addProjectUpdate(updateData: any): Promise<ProjectUpdate> {
    const update: ProjectUpdate = {
      id: this.updateIdCounter++,
      ...updateData,
      createdAt: new Date().toISOString()
    };
    this.updates.set(update.id, update);
    return update;
  }

  async getProjectUpdates(projectId: number): Promise<ProjectUpdate[]> {
    return Array.from(this.updates.values())
      .filter(update => update.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const storage = new InMemoryStorage();