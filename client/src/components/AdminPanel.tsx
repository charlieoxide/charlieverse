import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FolderOpen, 
  TrendingUp, 
  Settings,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  BarChart
} from 'lucide-react';
import SearchFilter from './SearchFilter';
import BulkOperations from './BulkOperations';
import ProjectTimeline from './ProjectTimeline';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  projectType: string;
  budget: string;
  timeline: string;
  status: string;
  createdAt: string;
  userId: number;
}

interface AdminPanelProps {
  onBack?: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectForTimeline, setSelectedProjectForTimeline] = useState<Project | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
    setFilteredProjects(projects);
  }, [users, projects]);

  const fetchData = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/projects')
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter handlers for users
  const handleUserSearchChange = (query: string) => {
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.firstName.toLowerCase().includes(query.toLowerCase()) ||
      user.lastName.toLowerCase().includes(query.toLowerCase()) ||
      user.company.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserFilterChange = (filters: any) => {
    let filtered = [...users];

    if (filters.status.length > 0) {
      filtered = filtered.filter(user => {
        const status = user.isActive ? 'active' : 'inactive';
        return filters.status.includes(status);
      });
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'title':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'status':
          comparison = (a.isActive ? 'active' : 'inactive').localeCompare(b.isActive ? 'active' : 'inactive');
          break;
        case 'date':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredUsers(filtered);
  };

  // Search and filter handlers for projects
  const handleProjectSearchChange = (query: string) => {
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase()) ||
      project.projectType.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleProjectFilterChange = (filters: any) => {
    let filtered = [...projects];

    if (filters.status.length > 0) {
      filtered = filtered.filter(project => filters.status.includes(project.status));
    }

    if (filters.projectType.length > 0) {
      filtered = filtered.filter(project => filters.projectType.includes(project.projectType));
    }

    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(project => {
        const projectDate = new Date(project.createdAt);
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
        
        if (startDate && projectDate < startDate) return false;
        if (endDate && projectDate > endDate) return false;
        return true;
      });
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'date':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredProjects(filtered);
  };

  // Bulk operations handlers
  const handleSelectAllUsers = (selected: boolean) => {
    setSelectedUsers(selected ? filteredUsers.map(u => u.id) : []);
  };

  const handleSelectAllProjects = (selected: boolean) => {
    setSelectedProjects(selected ? filteredProjects.map(p => p.id) : []);
  };

  const handleBulkUserStatusUpdate = async (status: string) => {
    try {
      await Promise.all(
        selectedUsers.map(userId =>
          fetch(`/api/admin/users/${userId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: status === 'active' })
          })
        )
      );
      fetchData();
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleBulkProjectStatusUpdate = async (status: string) => {
    try {
      await Promise.all(
        selectedProjects.map(projectId =>
          fetch(`/api/admin/projects/${projectId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
          })
        )
      );
      fetchData();
      setSelectedProjects([]);
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const handleBulkExport = (type: 'users' | 'projects') => {
    const data = type === 'users' 
      ? filteredUsers.filter(u => selectedUsers.includes(u.id))
      : filteredProjects.filter(p => selectedProjects.includes(p.id));
    
    const csv = type === 'users'
      ? 'Email,Name,Company,Role,Status,Created\n' + 
        data.map(u => `${u.email},"${u.firstName} ${u.lastName}",${u.company},${u.role},${u.isActive ? 'Active' : 'Inactive'},${u.createdAt}`).join('\n')
      : 'Title,Type,Budget,Status,Created\n' +
        data.map(p => `"${p.title}",${p.projectType},${p.budget},${p.status},${p.createdAt}`).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateProjectStatus = async (projectId: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen panel-background theme-transition">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative bg-card/80 backdrop-blur-sm shadow-sm border-b border-border card-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <Badge variant="secondary">Administrator</Badge>
            </div>
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Site</span>
                </button>
              )}
              <span className="text-sm text-muted-foreground">
                Welcome, {currentUser?.firstName} {currentUser?.lastName}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-8 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart className="inline mr-2 h-4 w-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="inline mr-2 h-4 w-4" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === 'projects'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FolderOpen className="inline mr-2 h-4 w-4" />
            Projects
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  +{users.filter(u => u.isActive).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">
                  +{projects.filter(p => p.status === 'pending').length} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'completed').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Projects completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'in_progress').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active projects
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <SearchFilter
              onFilterChange={handleUserFilterChange}
              onSearchChange={handleUserSearchChange}
              totalItems={users.length}
              itemType="users"
            />

            <BulkOperations
              selectedItems={selectedUsers}
              onSelectAll={handleSelectAllUsers}
              onSelectItem={(id, selected) => {
                setSelectedUsers(prev => 
                  selected ? [...prev, id] : prev.filter(uid => uid !== id)
                );
              }}
              onBulkStatusUpdate={handleBulkUserStatusUpdate}
              onBulkDelete={() => console.log('Bulk delete users')}
              onBulkExport={() => handleBulkExport('users')}
              totalItems={filteredUsers.length}
              itemType="users"
            />

            <div className="bg-card rounded-lg border border-border shadow-sm">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-medium text-foreground">User Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <input
                          type="checkbox"
                          className="rounded border-input"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={(e) => handleSelectAllUsers(e.target.checked)}
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-input"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user.id]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                              }
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {user.company || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={user.isActive ? 'default' : 'destructive'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <SearchFilter
              onFilterChange={handleProjectFilterChange}
              onSearchChange={handleProjectSearchChange}
              totalItems={projects.length}
              itemType="projects"
            />

            <BulkOperations
              selectedItems={selectedProjects}
              onSelectAll={handleSelectAllProjects}
              onSelectItem={(id, selected) => {
                setSelectedProjects(prev => 
                  selected ? [...prev, id] : prev.filter(pid => pid !== id)
                );
              }}
              onBulkStatusUpdate={handleBulkProjectStatusUpdate}
              onBulkDelete={() => console.log('Bulk delete projects')}
              onBulkExport={() => handleBulkExport('projects')}
              totalItems={filteredProjects.length}
              itemType="projects"
            />

            <div className="grid gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <input
                          type="checkbox"
                          className="mt-1 rounded border-input"
                          checked={selectedProjects.includes(project.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProjects([...selectedProjects, project.id]);
                            } else {
                              setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">{project.title}</h4>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground mb-3">
                            <span>Type: {project.projectType.replace('_', ' ')}</span>
                            <span>Budget: {project.budget}</span>
                            <span>Timeline: {project.timeline}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Created: {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProjectForTimeline(
                                selectedProjectForTimeline?.id === project.id ? null : project
                              )}
                            >
                              {selectedProjectForTimeline?.id === project.id ? 'Hide Timeline' : 'View Timeline'}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <select
                          value={project.status}
                          onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                          className="text-sm border border-input rounded px-2 py-1 bg-background text-foreground"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Project Timeline */}
                    {selectedProjectForTimeline?.id === project.id && (
                      <div className="mt-6 border-t border-border pt-6">
                        <ProjectTimeline projectId={project.id} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}