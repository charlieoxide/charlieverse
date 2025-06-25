import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthWrapper from './components/AuthWrapper';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'profile' | 'admin'>('home');
  const { currentUser, loading } = useAuth();

  const showAuth = () => setCurrentView('auth');
  const showHome = () => setCurrentView('home');
  const showProfile = () => setCurrentView('profile');
  const showAdmin = () => setCurrentView('admin');

  const handleAuthSuccess = () => {
    setCurrentView('profile');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (currentView === 'auth') {
    return <AuthWrapper onBack={showHome} onSuccess={handleAuthSuccess} />;
  }

  if (currentView === 'profile' && currentUser) {
    return <UserProfile />;
  }

  if (currentView === 'admin' && currentUser?.role === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header 
        onAuthClick={currentUser ? showProfile : showAuth}
        onAdminClick={currentUser?.role === 'admin' ? showAdmin : undefined}
        currentUser={currentUser}
      />
      <Hero onAuthClick={currentUser ? showProfile : showAuth} />
      <Services />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;