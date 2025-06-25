import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

interface AuthWrapperProps {
  onBack: () => void;
  onSuccess: () => void;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ onBack, onSuccess }) => {
  const [currentView, setCurrentView] = useState<'login' | 'signup'>('login');

  const switchToLogin = () => setCurrentView('login');
  const switchToSignup = () => setCurrentView('signup');

  if (currentView === 'login') {
    return <Login onBack={onBack} onSwitchToSignup={switchToSignup} onSuccess={onSuccess} />;
  }

  return <Signup onBack={onBack} onSwitchToLogin={switchToLogin} onSuccess={onSuccess} />;
};

export default AuthWrapper;