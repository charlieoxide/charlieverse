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

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'profile'>('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const showAuth = () => setCurrentView('auth');
  const showHome = () => setCurrentView('home');
  const showProfile = () => setCurrentView('profile');

  const handleAuthSuccess = () => {
    setCurrentView('profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (currentView === 'auth') {
    return <AuthWrapper onBack={showHome} onSuccess={handleAuthSuccess} />;
  }

  if (currentView === 'profile' && currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <UserProfile />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header onAuthClick={showAuth} />
      <Hero onAuthClick={showAuth} />
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