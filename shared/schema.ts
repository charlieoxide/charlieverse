import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  serial,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 50 }).default("user"),
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  company: varchar("company", { length: 255 }),
  firebaseUid: varchar("firebase_uid", { length: 255 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  projectType: varchar("project_type", { length: 100 }),
  budget: varchar("budget", { length: 100 }),
  timeline: varchar("timeline", { length: 100 }),
  status: varchar("status", { length: 50 }).default("pending"),
  priority: varchar("priority", { length: 50 }).default("medium"),
  contactMethod: varchar("contact_method", { length: 50 }).default("email"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectUpdates = pgTable("project_updates", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  userId: integer("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  projectUpdates: many(projectUpdates),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  updates: many(projectUpdates),
}));

export const projectUpdatesRelations = relations(projectUpdates, ({ one }) => ({
  project: one(projects, {
    fields: [projectUpdates.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectUpdates.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  phone: true,
  company: true,
  bio: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  projectType: true,
  budget: true,
  timeline: true,
  contactMethod: true,
});

export const updateUserSchema = createInsertSchema(users).pick({
  firstName: true,
  lastName: true,
  phone: true,
  company: true,
  bio: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type ProjectUpdate = typeof projectUpdates.$inferSelect;
export type UpdateUser = z.infer<typeof updateUserSchema>;
