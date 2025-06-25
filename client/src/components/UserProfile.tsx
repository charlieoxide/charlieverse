import React, { useState, useEffect } from 'react';
import { User, LogOut, Mail, Calendar, Shield, FileText, Send, Edit, Save, X, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface QuoteFormData {
  title: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  contactMethod: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  projectType: string;
  budget: string;
  timeline: string;
  status: string;
  createdAt: string;
}

const UserProfile: React.FC = () => {
  const { currentUser, logout, updateProfile } = useAuth();
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
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
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phone: currentUser.phone || '',
        company: currentUser.company || '',
        bio: currentUser.bio || ''
      });
      fetchProjects();
    }
  }, [currentUser]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileForm);
      setEditingProfile(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQuote(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(quoteForm),
      });

      if (response.ok) {
        setQuoteSuccess(true);
        setQuoteForm({
          title: '',
          projectType: '',
          budget: '',
          timeline: '',
          description: '',
          contactMethod: 'email'
        });
        fetchProjects();
        setTimeout(() => {
          setShowQuoteForm(false);
          setQuoteSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Quote submission failed:', error);
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  if (!currentUser) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400">My Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  {editingProfile ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                </button>
              </div>

              {editingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input
                      type="text"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({...profileForm, company: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-20"
                    />
                  </div>
                  <button
                    onClick={handleProfileUpdate}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-cyan-400" />
                    <span>{currentUser.firstName} {currentUser.lastName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-cyan-400" />
                    <span>{currentUser.email}</span>
                  </div>
                  {currentUser.phone && (
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-cyan-400" />
                      <span>{currentUser.phone}</span>
                    </div>
                  )}
                  {currentUser.company && (
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-cyan-400" />
                      <span>{currentUser.company}</span>
                    </div>
                  )}
                  {currentUser.bio && (
                    <div className="mt-4">
                      <p className="text-gray-300 text-sm">{currentUser.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowQuoteForm(true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <FileText className="h-5 w-5" />
              <span>Request a Quote</span>
            </button>
          </div>

          {/* Projects Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">My Projects</h2>
            
            {projects.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No projects yet. Request a quote to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project._id} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <p className="text-white">{project.projectType}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Budget:</span>
                        <p className="text-white">{project.budget}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Timeline:</span>
                        <p className="text-white">{project.timeline}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Created:</span>
                        <p className="text-white">{new Date(project.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quote Form Modal */}
        {showQuoteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Request a Quote</h2>
                <button
                  onClick={() => setShowQuoteForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {quoteSuccess ? (
                <div className="text-center py-8">
                  <div className="text-green-400 text-6xl mb-4">✓</div>
                  <h3 className="text-xl font-semibold mb-2">Quote Request Submitted!</h3>
                  <p className="text-gray-300">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Title</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.title}
                      onChange={(e) => setQuoteForm({...quoteForm, title: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="Brief project title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Project Type</label>
                    <select
                      required
                      value={quoteForm.projectType}
                      onChange={(e) => setQuoteForm({...quoteForm, projectType: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="">Select project type</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-app">Mobile App</option>
                      <option value="e-commerce">E-commerce</option>
                      <option value="consultation">Consultation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Range</label>
                    <select
                      required
                      value={quoteForm.budget}
                      onChange={(e) => setQuoteForm({...quoteForm, budget: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-15k">$5,000 - $15,000</option>
                      <option value="15k-50k">$15,000 - $50,000</option>
                      <option value="50k-plus">$50,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Timeline</label>
                    <select
                      required
                      value={quoteForm.timeline}
                      onChange={(e) => setQuoteForm({...quoteForm, timeline: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="3-months">Within 3 months</option>
                      <option value="6-months">Within 6 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Project Description</label>
                    <textarea
                      required
                      value={quoteForm.description}
                      onChange={(e) => setQuoteForm({...quoteForm, description: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-32"
                      placeholder="Describe your project requirements..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Contact Method</label>
                    <select
                      value={quoteForm.contactMethod}
                      onChange={(e) => setQuoteForm({...quoteForm, contactMethod: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowQuoteForm(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingQuote}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 py-2 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {isSubmittingQuote ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;