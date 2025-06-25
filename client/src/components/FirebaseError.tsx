import React from 'react';
import { AlertTriangle, Settings } from 'lucide-react';

const FirebaseError: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Firebase Configuration Required
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This application requires Firebase authentication to be configured. 
            Please provide your Firebase credentials in the environment variables.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Required Environment Variables:
              </span>
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• VITE_FIREBASE_API_KEY</li>
              <li>• VITE_FIREBASE_PROJECT_ID</li>
              <li>• VITE_FIREBASE_APP_ID</li>
            </ul>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>
              Get these values from your{' '}
              <a 
                href="https://console.firebase.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
              >
                Firebase Console
              </a>
              {' '}under Project Settings → General → Your apps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseError;