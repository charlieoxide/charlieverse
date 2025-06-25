import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

interface AuthWrapperProps {
  onBack: () => void;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<'login' | 'signup'>('login');

  const switchToLogin = () => setCurrentView('login');
  const switchToSignup = () => setCurrentView('signup');

  if (currentView === 'login') {
    return <Login onBack={onBack} onSwitchToSignup={switchToSignup} />;
  }

  return <Signup onBack={onBack} onSwitchToLogin={switchToLogin} />;
};

export default AuthWrapper;