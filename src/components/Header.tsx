import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, Play, Bell, Shield, Heart } from 'lucide-react';
import Logo3D from './Logo3D';

interface HeaderProps {
  onOpenAuth: (mode: 'login' | 'signup' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Who We Are', path: '/who-we-are' },
    { name: 'What We Do', path: '/what-we-do' },
    { name: 'Blog', path: '/blog' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Alerts', path: '/alerts' },
    { name: 'Contact', path: '/contact' },
    { name: 'Support Us', path: '/support' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <Logo3D />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prevora
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link 
              to="/alerts"
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </Link>
            <Link 
              to="/support"
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <button 
              onClick={() => onOpenAuth('login')}
              className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden lg:inline">Log In</span>
            </button>
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-4 lg:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200"
            >
              <Play className="h-4 w-4" />
              <span>Demo</span>
            </Link>
            
            {/* Bolt.new Badge */}
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-2 hover:opacity-90 transition-opacity"
            >
              <img 
                src="/img.jpg" 
                alt="Powered by Bolt.new" 
                className="h-8 w-8"
              />
            </a>
          </div>

          {/* Mobile Menu Button and Bolt Badge */}
          <div className="flex items-center space-x-3 lg:hidden">
            {/* Bolt.new Badge (Mobile) */}
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-90 transition-opacity"
            >
              <img 
                src="/img.jpg" 
                alt="Powered by Bolt.new" 
                className="h-8 w-8"
              />
            </a>
            
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                <Link 
                  to="/alerts"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Bell className="h-4 w-4" />
                  <span>Alerts</span>
                  <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </Link>
                <Link 
                  to="/support"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="h-4 w-4" />
                  <span>Support Us</span>
                </Link>
                <button 
                  onClick={() => {
                    onOpenAuth('login');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Log In</span>
                </button>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Play className="h-4 w-4" />
                  <span>Book a Demo</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;