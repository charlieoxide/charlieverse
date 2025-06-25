
import React, { useState } from 'react';
import { User, LogOut, Mail, Calendar, Shield, FileText, Send } from 'lucide-react';

interface QuoteFormData {
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  contactMethod: string;
}

const UserProfile: React.FC = () => {
  // Simulate current user data
  const currentUser = {
    id: 1,
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User'
  };
  
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteForm, setQuoteForm] = useState<QuoteFormData>({
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    contactMethod: 'email'
  });
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  const handleLogout = async () => {
    try {
      console.log('Logout clicked');
      // Logout functionality will be implemented with backend
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleQuoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuoteForm(prev => ({ ...prev, [name]: value }));
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQuote(true);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteForm),
      });

      if (response.ok) {
        setQuoteSuccess(true);
        setQuoteForm({
          projectType: '',
          budget: '',
          timeline: '',
          description: '',
          contactMethod: 'email'
        });
        setTimeout(() => {
          setShowQuoteForm(false);
          setQuoteSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Quote submission failed:', error);
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <User className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-white font-medium">
                  {currentUser.firstName && currentUser.lastName 
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : 'Not set'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Mail className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-medium">{currentUser.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Shield className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Account Status</p>
                <p className="text-green-400 font-medium">Active</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">User ID</p>
                <p className="text-white font-medium">#{currentUser.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Request Quote Button */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={() => setShowQuoteForm(true)}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <FileText className="h-5 w-5" />
            <span>Request a Quote</span>
          </button>
        </div>
      </div>

      {/* Quote Request Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Request a Quote</h3>
              <button
                onClick={() => setShowQuoteForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {quoteSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-green-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Quote Request Submitted!</h4>
                <p className="text-gray-400">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Type
                    </label>
                    <select
                      name="projectType"
                      value={quoteForm.projectType}
                      onChange={handleQuoteChange}
                      required
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    >
                      <option value="">Select project type</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-app">Mobile App</option>
                      <option value="ai-integration">AI Integration</option>
                      <option value="cloud-solutions">Cloud Solutions</option>
                      <option value="consulting">Consulting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={quoteForm.budget}
                      onChange={handleQuoteChange}
                      required
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-15k">$5,000 - $15,000</option>
                      <option value="15k-50k">$15,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="over-100k">Over $100,000</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Timeline
                  </label>
                  <select
                    name="timeline"
                    value={quoteForm.timeline}
                    onChange={handleQuoteChange}
                    required
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">ASAP (Rush)</option>
                    <option value="1-month">1 Month</option>
                    <option value="2-3-months">2-3 Months</option>
                    <option value="3-6-months">3-6 Months</option>
                    <option value="6-months-plus">6+ Months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    value={quoteForm.description}
                    onChange={handleQuoteChange}
                    required
                    rows={4}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    placeholder="Describe your project requirements, goals, and any specific features you need..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Contact Method
                  </label>
                  <select
                    name="contactMethod"
                    value={quoteForm.contactMethod}
                    onChange={handleQuoteChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="video-call">Video Call</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowQuoteForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingQuote}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isSubmittingQuote ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
  );
};

export default UserProfile;
