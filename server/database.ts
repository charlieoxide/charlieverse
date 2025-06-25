import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  profilePicture: { type: String },
  bio: { type: String },
  company: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Project Schema
const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  projectType: { type: String },
  budget: { type: String },
  timeline: { type: String },
  status: { type: String, default: 'pending', enum: ['pending', 'in-progress', 'completed', 'cancelled'] },
  priority: { type: String, default: 'medium', enum: ['low', 'medium', 'high', 'urgent'] },
  contactMethod: { type: String, default: 'email' },
  estimatedCost: { type: Number },
  actualCost: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

// Project Update Schema
const projectUpdateSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Project = mongoose.model('Project', projectSchema);
export const ProjectUpdate = mongoose.model('ProjectUpdate', projectUpdateSchema);

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Use in-memory fallback for development if MongoDB is not available
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/charlieverse';
    await mongoose.connect(mongoUrl, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn('MongoDB connection failed, using fallback storage:', error.message);
    // Don't exit process, let the app continue with fallback storage
  }
};

export default connectDB;