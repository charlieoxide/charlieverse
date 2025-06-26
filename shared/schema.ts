import { pgTable, serial, text, boolean, timestamp, integer, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Database tables
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  role: text('role').default('user'),
  profilePicture: text('profile_picture'),
  bio: text('bio'),
  company: text('company'),
  firebaseUid: text('firebase_uid').unique(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  projectType: text('project_type'),
  budget: text('budget'),
  timeline: text('timeline'),
  priority: text('priority'),
  contactMethod: text('contact_method'),
  status: text('status').default('pending').notNull(),
  estimatedCost: numeric('estimated_cost'),
  actualCost: numeric('actual_cost'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const projectUpdates = pgTable('project_updates', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  projectType: text('project_type').notNull(),
  message: text('message').notNull(),
  status: text('status').default('new').notNull(),
  adminNotes: text('admin_notes'),
  repliedAt: timestamp('replied_at'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects)
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  updates: many(projectUpdates)
}));

export const projectUpdatesRelations = relations(projectUpdates, ({ one }) => ({
  project: one(projects, { fields: [projectUpdates.projectId], references: [projects.id] })
}));

// TypeScript types inferred from schema
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectUpdate = typeof projectUpdates.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Insert schemas with validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertProjectUpdateSchema = createInsertSchema(projectUpdates).omit({
  id: true,
  createdAt: true
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true
});

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertProjectUpdate = z.infer<typeof insertProjectUpdateSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

// Update types
export type UpdateUser = Partial<InsertUser>;
export type UpdateProject = Partial<InsertProject>;