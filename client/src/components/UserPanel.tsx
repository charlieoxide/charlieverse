import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SearchFilter from './SearchFilter';
import ProjectTimeline from './ProjectTimeline';
import { 
  User, 
  FolderOpen, 
  Plus, 
  Eye,
  Settings,
  Calendar,
  DollarSign,
  Clock
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  projectType: string;
  budget: string;
  timeline: string;
  status: string;
  createdAt: string;
}

interface QuoteFormData {
  title: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  contactMethod: string;
}

interface UserPanelProps {
  onBack?: () => void;
}

export default function UserPanel({ onBack }: UserPanelProps) {
  const { currentUser, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [quoteForm, setQuoteForm] = useState<QuoteFormData>({
    title: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    contactMethod: 'email'
  });

  const [profileForm, setProfileForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phone: currentUser?.phone || '',
    company: currentUser?.company || '',
    bio: currentUser?.bio || ''
  });

  useEffect(() => {
    fetchProjects();
    
    // Set up more frequent polling to check for project updates every 2 seconds
    const interval = setInterval(fetchProjects, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('User fetched projects:', data.length, 'projects');
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (query: string) => {
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase()) ||
      project.projectType.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...projects];

    // Filter by status
    if (filters.status.length > 0) {
      filtered = filtered.filter(project => filters.status.includes(project.status));
    }

    // Filter by project type
    if (filters.projectType.length > 0) {
      filtered = filtered.filter(project => filters.projectType.includes(project.projectType));
    }

    // Filter by date range
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

    // Sort
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

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteForm),
      });

      if (response.ok) {
        setShowQuoteForm(false);
        setQuoteForm({
          title: '',
          projectType: '',
          budget: '',
          timeline: '',
          description: '',
          contactMethod: 'email'
        });
        fetchProjects();
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
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
              <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
              <Badge variant="secondary">User</Badge>
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
            <FolderOpen className="inline mr-2 h-4 w-4" />
            Dashboard
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
            My Projects
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="inline mr-2 h-4 w-4" />
            Profile
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {projects.filter(p => p.status === 'pending').length} pending review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
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

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {projects.filter(p => p.status === 'completed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Finished projects
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
              <Button onClick={() => setShowQuoteForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Request Quote
              </Button>
            </div>

            <div className="grid gap-4">
              {projects.slice(0, 3).map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">
                            Type: {project.projectType}
                          </span>
                          <span className="text-xs text-gray-500">
                            Budget: {project.budget}
                          </span>
                          <span className="text-xs text-gray-500">
                            Timeline: {project.timeline}
                          </span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-lg font-medium text-foreground">All Projects</h3>
              <Button onClick={() => setShowQuoteForm(true)} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Request Quote
              </Button>
            </div>

            <SearchFilter
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
              totalItems={projects.length}
              itemType="projects"
            />

            <div className="grid gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h4 className="font-medium text-foreground truncate">{project.title}</h4>
                          <Badge className={`${getStatusColor(project.status)} self-start sm:self-center`}>
                            {project.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <span className="font-medium mr-1">Type:</span> {project.projectType.replace('_', ' ')}
                          </span>
                          <span className="flex items-center">
                            <span className="font-medium mr-1">Budget:</span> {project.budget}
                          </span>
                          <span className="flex items-center">
                            <span className="font-medium mr-1">Timeline:</span> {project.timeline}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-2">
                          <div className="text-xs text-muted-foreground">
                            Created: {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedProject(selectedProject?.id === project.id ? null : project)}
                            className="self-start sm:self-center"
                          >
                            {selectedProject?.id === project.id ? 'Hide Timeline' : 'View Timeline'}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Project Timeline */}
                    {selectedProject?.id === project.id && (
                      <div className="mt-6 border-t border-border pt-6">
                        <ProjectTimeline projectId={project.id} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {filteredProjects.length === 0 && projects.length > 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No projects match your current filters.
                </div>
              )}
              
              {projects.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  No projects yet. Click "Request Quote" to get started!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({...profileForm, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      rows={4}
                    />
                  </div>
                  <Button type="submit">Update Profile</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4 text-foreground">Request Project Quote</h3>
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={quoteForm.title}
                    onChange={(e) => setQuoteForm({...quoteForm, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <select
                    id="projectType"
                    value={quoteForm.projectType}
                    onChange={(e) => setQuoteForm({...quoteForm, projectType: e.target.value})}
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="web_development">Web Development</option>
                    <option value="mobile_app">Mobile App</option>
                    <option value="e_commerce">E-commerce</option>
                    <option value="custom_software">Custom Software</option>
                    <option value="api_integration">API Integration</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <select
                    id="budget"
                    value={quoteForm.budget}
                    onChange={(e) => setQuoteForm({...quoteForm, budget: e.target.value})}
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                    required
                  >
                    <option value="">Select budget</option>
                    <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                    <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                    <option value="$50,000+">$50,000+</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <select
                    id="timeline"
                    value={quoteForm.timeline}
                    onChange={(e) => setQuoteForm({...quoteForm, timeline: e.target.value})}
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                    required
                  >
                    <option value="">Select timeline</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2-3 months">2-3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year+">1 year+</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={quoteForm.description}
                    onChange={(e) => setQuoteForm({...quoteForm, description: e.target.value})}
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setShowQuoteForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Request</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}