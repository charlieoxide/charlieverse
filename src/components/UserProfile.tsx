
import React from 'react';
import { User, LogOut, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-8">
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
              <p className="text-sm text-gray-400">Display Name</p>
              <p className="text-white font-medium">
                {currentUser.displayName || 'Not set'}
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
              <p className="text-sm text-gray-400">Email Verified</p>
              <p className={`font-medium ${currentUser.emailVerified ? 'text-green-400' : 'text-red-400'}`}>
                {currentUser.emailVerified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Account Created</p>
              <p className="text-white font-medium">
                {currentUser.metadata.creationTime ? 
                  new Date(currentUser.metadata.creationTime).toLocaleDateString() : 
                  'Unknown'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-300">
          <strong>User ID:</strong> {currentUser.uid}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
