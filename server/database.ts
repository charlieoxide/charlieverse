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
    const mongoUrl = process.env.MONGODB_URL || 'mongodb+srv://charlieverse:ZI4A4B9UMahekTXc@cluster0.0iqfe4u.mongodb.net/charlieverse';
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB Atlas connected successfully');
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed, using fallback storage:', error.message);
    return false;
  }
};

export default connectDB;