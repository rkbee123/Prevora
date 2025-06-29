import React from 'react';
import { Shield } from 'lucide-react';

const Logo3D = () => {
  return (
    <div className="relative">
      {/* Animated 3D-style logo with enhanced effects */}
      <div className="relative w-10 h-10 transform-gpu">
        {/* Multiple background glows for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl blur-md opacity-75 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-pink-600 rounded-xl blur-lg opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Main logo container with enhanced 3D effect */}
        <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-2xl transform hover:scale-110 transition-all duration-500 hover:rotate-12 hover:shadow-blue-500/50">
          {/* Inner gradient layers for depth */}
          <div className="absolute inset-1 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg opacity-60"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-blue-300 to-purple-300 rounded-md opacity-40"></div>
          
          {/* Shield icon with enhanced styling */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="h-6 w-6 text-white drop-shadow-lg filter brightness-110" />
          </div>
          
          {/* Animated particles with varied timing */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-75" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-0 left-0 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.7s' }}></div>
          
          {/* Rotating border effect */}
          <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-300" style={{ 
            background: 'linear-gradient(45deg, transparent, transparent, rgba(59, 130, 246, 0.5), transparent, transparent)',
            animation: 'spin 3s linear infinite'
          }}></div>
        </div>
        
        {/* Enhanced reflection effect */}
        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full opacity-30 blur-sm"></div>
        <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full opacity-50 blur-xs"></div>
        
        {/* Floating sparkles */}
        <div className="absolute -top-2 left-1/2 w-1 h-1 bg-white rounded-full animate-bounce opacity-70" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 -right-2 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-ping opacity-80" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
};

export default Logo3D;