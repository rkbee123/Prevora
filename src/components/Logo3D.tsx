import React from 'react';
import { Shield } from 'lucide-react';

const Logo3D = () => {
  return (
    <div className="relative">
      {/* Animated 3D-style logo */}
      <div className="relative w-10 h-10 transform-gpu">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl blur-sm opacity-75 animate-pulse"></div>
        
        {/* Main logo container */}
        <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-300 hover:rotate-12">
          {/* Inner glow */}
          <div className="absolute inset-1 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg opacity-50"></div>
          
          {/* Shield icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="h-6 w-6 text-white drop-shadow-lg" />
          </div>
          
          {/* Animated particles */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-75"></div>
        </div>
        
        {/* Reflection effect */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full opacity-20 blur-sm"></div>
      </div>
    </div>
  );
};

export default Logo3D;