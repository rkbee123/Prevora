import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import WhoWeArePage from './pages/WhoWeArePage';
import WhatWeDoPage from './pages/WhatWeDoPage';
import BlogPage from './pages/BlogPage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import AlertsPage from './pages/AlertsPage';
import AdminPage from './pages/AdminPage';
import EventDetailPage from './pages/EventDetailPage';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'admin'>('login');

  const openAuthModal = (mode: 'login' | 'signup' | 'admin') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header onOpenAuth={openAuthModal} />
        <Routes>
          <Route path="/" element={<HomePage onOpenAuth={openAuthModal} />} />
          <Route path="/who-we-are" element={<WhoWeArePage />} />
          <Route path="/what-we-do" element={<WhatWeDoPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Footer />
        
        {showAuthModal && (
          <AuthModal 
            mode={authMode}
            onClose={() => setShowAuthModal(false)}
            onSwitchMode={setAuthMode}
          />
        )}
      </div>
    </Router>
  );
}

export default App;