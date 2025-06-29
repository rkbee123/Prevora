import React from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  onOpenAuth: (mode: 'login' | 'signup' | 'admin') => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        {/* Animated Glowing Clusters */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-50"></div>
        <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-teal-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute bottom-1/4 right-1/2 w-3 h-3 bg-indigo-400 rounded-full animate-pulse opacity-50"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
            Detect outbreaks
          </span>
          <br />
          <span className="text-white">before they spread.</span>
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
          The world's first AI-powered prevention network: real-time signals, smart algorithms, 
          and a mission to save lives.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 px-6 md:px-8 py-3 md:py-4 bg-white text-gray-900 rounded-lg font-semibold text-base md:text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <Play className="h-5 w-5" />
            <span>See How It Works</span>
          </Link>
          <button 
            onClick={() => onOpenAuth('signup')}
            className="flex items-center space-x-2 px-6 md:px-8 py-3 md:py-4 border-2 border-blue-400 text-blue-400 rounded-lg font-semibold text-base md:text-lg hover:bg-blue-400 hover:text-white transition-all duration-300"
          >
            <span>Join the Movement</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;