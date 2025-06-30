import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Linkedin, Twitter, Github, Mail, Heart } from 'lucide-react';
import DonateButton from './DonateButton';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Prevora</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              The world's first AI-powered prevention network for early disease detection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/who-we-are" className="text-gray-400 hover:text-white transition-colors text-sm">Who We Are</Link></li>
              <li><Link to="/what-we-do" className="text-gray-400 hover:text-white transition-colors text-sm">What We Do</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">Dashboard</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">API Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Integrations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support Us</h3>
            <p className="text-gray-400 text-sm mb-4">Help us expand our early warning system to more communities.</p>
            <DonateButton 
              buttonText="Donate" 
              showIcon={true}
              className="px-4 py-2 text-sm"
            />
            <ul className="space-y-2 mt-4">
              <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Ways to Support</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Prevora. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Prevora does not provide medical diagnosis. Data is anonymized and used for population-level insights only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;