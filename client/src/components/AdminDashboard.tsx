import React, { useState, useEffect } from 'react';
import { Users, FileText, DollarSign, Clock, CheckCircle, AlertCircle, Plus, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Project {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  projectType: string;
  budget: string;
  timeline: string;
  status: string;
  estimatedCost?: number;
  actualCost?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  userId: User;
}

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newUpdate, setNewUpdate] = useState({ title: '', description: '', status: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
      fetchProjects();
      
      // Set up polling to check for new projects every 5 seconds
      const interval = setInterval(() => {
        fetchUsers();
        fetchProjects();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (projectId: string, status: string, updates: any = {}) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status, ...updates }),
      });

      if (response.ok) {
        fetchProjects();
        setSelectedProject(null);
        setShowProjectModal(false);
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const addProjectUpdate = async () => {
    if (!selectedProject || !newUpdate.title) return;

    try {
      const response = await fetch(`/api/admin/projects/${selectedProject._id}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newUpdate),
      });

      if (response.ok) {
        setNewUpdate({ title: '', description: '', status: '' });
        // Refresh projects or fetch updates
      }
    } catch (error) {
      console.error('Failed to add update:', error);
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalUsers: users.length,
    totalProjects: projects.length,
    pendingProjects: projects.filter(p => p.status === 'pending').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-cyan-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Projects</p>
                <p className="text-2xl font-bold">{stats.totalProjects}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingProjects}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold">{stats.completedProjects}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Table */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Role</th>
                    <th className="text-left py-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map((user) => (
                    <tr key={user._id} className="border-b border-gray-700">
                      <td className="py-2">{user.firstName} {user.lastName}</td>
                      <td className="py-2 text-gray-300">{user.email}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-2 text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Project Management</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No projects found</p>
                <p className="text-sm">Projects will appear here when users submit requests</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {projects.map((project) => (
                  <div key={project._id || project.id} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{project.title || 'Untitled Project'}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status || 'pending'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      Client: {project.userId?.firstName || 'Unknown'} {project.userId?.lastName || 'User'}
                    </p>
                    <p className="text-gray-300 text-sm mb-3">{project.description || 'No description provided'}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        {project.projectType || 'General'} • {project.budget || 'Budget TBD'}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setShowProjectModal(true);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Manage</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project Management Modal */}
        {showProjectModal && selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Manage Project: {selectedProject.title}</h2>
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Project Info */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Project Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Client:</span>
                      <p>{selectedProject.userId.firstName} {selectedProject.userId.lastName}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <p>{selectedProject.userId.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <p>{selectedProject.projectType}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Budget:</span>
                      <p>{selectedProject.budget}</p>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Update Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        const projectId = selectedProject._id || selectedProject.id?.toString();
                        if (projectId) updateProjectStatus(projectId, 'in_progress');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
                    >
                      Start Project
                    </button>
                    <button
                      onClick={() => {
                        const projectId = selectedProject._id || selectedProject.id?.toString();
                        if (projectId) updateProjectStatus(projectId, 'completed');
                      }}
                      className="bg-green-600 hover:bg-green-700 py-2 rounded-lg"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>

                {/* Add Update */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Add Project Update</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Update title"
                      value={newUpdate.title}
                      onChange={(e) => setNewUpdate({...newUpdate, title: e.target.value})}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                    />
                    <textarea
                      placeholder="Update description"
                      value={newUpdate.description}
                      onChange={(e) => setNewUpdate({...newUpdate, description: e.target.value})}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white h-20"
                    />
                    <button
                      onClick={addProjectUpdate}
                      className="bg-cyan-600 hover:bg-cyan-700 py-2 px-4 rounded-lg flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Update</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;