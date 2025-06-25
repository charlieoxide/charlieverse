import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthWrapper from './components/AuthWrapper';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'auth'>('home');

  const showAuth = () => setCurrentView('auth');
  const showHome = () => setCurrentView('home');

  if (currentView === 'auth') {
    return <AuthWrapper onBack={showHome} />;
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

export default App;