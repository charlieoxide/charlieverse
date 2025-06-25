import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthWrapper from './components/AuthWrapper';
import UserPanel from './components/UserPanel';
import AdminPanel from './components/AdminPanel';
import LoadingSpinner from './components/LoadingSpinner';
import { ThemeDebug } from './components/ThemeDebug';

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'user' | 'admin'>('home');
  const { currentUser, loading, logout } = useAuth();

  const showAuth = () => setCurrentView('auth');
  const showHome = () => setCurrentView('home');
  const showUserPanel = () => setCurrentView('user');
  const showAdminPanel = () => setCurrentView('admin');

  const handleAuthSuccess = () => {
    if (currentUser?.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('user');
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('home');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (currentView === 'auth') {
    return <AuthWrapper onBack={showHome} onSuccess={handleAuthSuccess} />;
  }

  if (currentView === 'user' && currentUser) {
    return <UserPanel onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'admin' && currentUser?.role === 'admin') {
    return <AdminPanel onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <Header 
        onAuthClick={() => {
          if (currentUser) {
            if (currentUser.role === 'admin') {
              showAdminPanel();
            } else {
              showUserPanel();
            }
          } else {
            showAuth();
          }
        }}
        onAdminClick={currentUser?.role === 'admin' ? showAdminPanel : undefined}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main>
        <Hero onAuthClick={showAuth} />
        <Services />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ThemeDebug />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;