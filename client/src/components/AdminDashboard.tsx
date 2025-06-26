import React, { useState, useEffect } from 'react';
import { Users, FileText, DollarSign, Clock, CheckCircle, AlertCircle, Plus, Edit, Mail, MessageSquare } from 'lucide-react';
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

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  repliedAt?: string;
  adminNotes?: string;
}

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [newUpdate, setNewUpdate] = useState({ title: '', description: '', status: '' });
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'contacts'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
      fetchProjects();
      fetchContacts();
      
      // Set up polling to check for new data every 5 seconds
      const interval = setInterval(() => {
        fetchUsers();
        fetchProjects();
        fetchContacts();
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

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const updateContactStatus = async (contactId: number, status: string, adminNotes?: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          status, 
          adminNotes,
          repliedAt: status === 'replied' ? new Date().toISOString() : undefined
        }),
      });

      if (response.ok) {
        fetchContacts();
        setSelectedContact(null);
        setShowContactModal(false);
      }
    } catch (error) {
      console.error('Failed to update contact:', error);
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

  const getContactStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalUsers: users.length,
    totalProjects: projects.length,
    pendingProjects: projects.filter(p => p.status === 'pending').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalContacts: contacts.length,
    newContacts: contacts.filter(c => c.status === 'new').length,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-8">Admin Dashboard</h1>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 rounded-md font-medium transition-colors relative ${
              activeTab === 'contacts'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Contact Messages ({contacts.length})
            {stats.newContacts > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {stats.newContacts}
              </span>
            )}
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <h3 className="text-2xl font-bold text-white">{stats.totalUsers}</h3>
                  </div>
                  <Users className="h-8 w-8 text-cyan-400" />
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Projects</p>
                    <h3 className="text-2xl font-bold text-white">{stats.totalProjects}</h3>
                  </div>
                  <FileText className="h-8 w-8 text-cyan-400" />
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Contact Messages</p>
                    <h3 className="text-2xl font-bold text-white">{stats.totalContacts}</h3>
                  </div>
                  <Mail className="h-8 w-8 text-cyan-400" />
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">New Messages</p>
                    <h3 className="text-2xl font-bold text-white">{stats.newContacts}</h3>
                  </div>
                  <MessageSquare className="h-8 w-8 text-red-400" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Contact Messages Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Contact Messages</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No contact messages found</p>
                <p className="text-sm">Contact messages will appear here when visitors submit the contact form</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{contact.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContactStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      Email: {contact.email} | Project: {contact.projectType}
                    </p>
                    {contact.phone && (
                      <p className="text-gray-400 text-sm mb-2">Phone: {contact.phone}</p>
                    )}
                    <p className="text-gray-300 text-sm mb-3">{contact.message}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        {new Date(contact.createdAt).toLocaleDateString()} at {new Date(contact.createdAt).toLocaleTimeString()}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateContactStatus(contact.id, 'read')}
                          disabled={contact.status === 'read' || contact.status === 'replied'}
                          className="text-yellow-400 hover:text-yellow-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Mark Read
                        </button>
                        <button
                          onClick={() => updateContactStatus(contact.id, 'replied', 'Replied via email')}
                          disabled={contact.status === 'replied'}
                          className="text-green-400 hover:text-green-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Mark Replied
                        </button>
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowContactModal(true);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center space-x-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Manage</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contact Management Modal */}
        {showContactModal && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Manage Contact: {selectedContact.name}</h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Contact Details</h3>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Name:</span>
                      <p>{selectedContact.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <p>{selectedContact.email}</p>
                    </div>
                    {selectedContact.phone && (
                      <div>
                        <span className="text-gray-400">Phone:</span>
                        <p>{selectedContact.phone}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Project Type:</span>
                      <p>{selectedContact.projectType}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Message:</span>
                      <p className="mt-1">{selectedContact.message}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Submitted:</span>
                      <p>{new Date(selectedContact.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Update Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => updateContactStatus(selectedContact.id, 'read')}
                      className="bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg"
                    >
                      Mark as Read
                    </button>
                    <button
                      onClick={() => updateContactStatus(selectedContact.id, 'replied')}
                      className="bg-green-600 hover:bg-green-700 py-2 rounded-lg"
                    >
                      Mark as Replied
                    </button>
                    <button
                      onClick={() => updateContactStatus(selectedContact.id, 'archived')}
                      className="bg-gray-600 hover:bg-gray-700 py-2 rounded-lg"
                    >
                      Archive
                    </button>
                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.projectType} Project&body=Hi ${selectedContact.name},%0D%0A%0D%0AThank you for contacting us about your ${selectedContact.projectType} project.`}
                      className="bg-cyan-600 hover:bg-cyan-700 py-2 rounded-lg text-center inline-block"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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