// Simple TypeScript interfaces for in-memory storage
// No Drizzle ORM or database dependencies

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: string | null;
  profilePicture: string | null;
  bio: string | null;
  company: string | null;
  firebaseUid: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  userId: number;
  title: string;
  description: string | null;
  projectType: string | null;
  budget: string | null;
  timeline: string | null;
  priority: string | null;
  contactMethod: string | null;
  estimatedCost: number | null;
  actualCost: number | null;
  startDate: string | null;
  endDate: string | null;
  completedAt: string | null;
}

export interface ProjectUpdate {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  status: string | null;
  createdAt: string;
}

// Insert types for creating new records
export interface InsertUser {
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  company?: string | null;
  firebaseUid?: string | null;
}

export interface InsertProject {
  userId: number;
  title: string;
  description?: string | null;
  projectType?: string | null;
  budget?: string | null;
  timeline?: string | null;
  priority?: string | null;
  contactMethod?: string | null;
  status?: string;
  estimatedCost?: number | null;
  actualCost?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  completedAt?: string | null;
}

// Update types for partial updates
export interface UpdateUser {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  bio?: string | null;
  company?: string | null;
  role?: string | null;
  firebaseUid?: string | null;
  isActive?: boolean;
}

export interface UpdateProject {
  title?: string;
  description?: string | null;
  projectType?: string | null;
  budget?: string | null;
  timeline?: string | null;
  priority?: string | null;
  contactMethod?: string | null;
  status?: string;
  estimatedCost?: number | null;
  actualCost?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  completedAt?: string | null;
}