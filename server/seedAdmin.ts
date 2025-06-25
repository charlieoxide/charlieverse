import bcrypt from 'bcrypt';
import { storage } from './storage';

export const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await storage.getUserByEmail('admin@charlieverse.com');
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await storage.createUser({
      email: 'admin@charlieverse.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      bio: 'System Administrator',
      company: 'Charlieverse'
    });

    console.log('Admin user created: admin@charlieverse.com / admin123');
  } catch (error) {
    console.error('Failed to create admin user:', error);
  }
};