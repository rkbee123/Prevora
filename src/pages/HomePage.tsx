import React from 'react';
import HeroSection from '../components/home/HeroSection';
import WhatWeDoSection from '../components/home/WhatWeDoSection';
import WhyWeDoItSection from '../components/home/WhyWeDoItSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import LiveFeedSection from '../components/home/LiveFeedSection';
import AIAssistantSection from '../components/home/AIAssistantSection';
import DashboardPreviewSection from '../components/home/DashboardPreviewSection';
import GetInvolvedSection from '../components/home/GetInvolvedSection';

interface HomePageProps {
  onOpenAuth: (mode: 'login' | 'signup' | 'admin') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onOpenAuth }) => {
  return (
    <div className="pt-20">
      <HeroSection onOpenAuth={onOpenAuth} />
      <WhatWeDoSection />
      <WhyWeDoItSection />
      <HowItWorksSection />
      <LiveFeedSection />
      <AIAssistantSection />
      <DashboardPreviewSection onOpenAuth={onOpenAuth} />
      <GetInvolvedSection />
    </div>
  );
};

export default HomePage;