import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

// Create database connection with fallback
let db: any;
let useDatabase = false;

if (process.env.DATABASE_URL) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
    useDatabase = true;
  } catch (error) {
    console.warn('Failed to initialize database connection:', error);
    useDatabase = false;
  }
} else {
  console.log('No DATABASE_URL provided, running without database');
  useDatabase = false;
}

export { db, useDatabase };

// Test database connection
export const connectDB = async () => {
  if (!useDatabase || !process.env.DATABASE_URL) {
    console.log('Database not configured - running with in-memory storage');
    return false;
  }
  
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`SELECT NOW()`;
    console.log('PostgreSQL connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

export default connectDB;