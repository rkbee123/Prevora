import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Heart, Shield, Users } from 'lucide-react';

const DonationSuccessPage = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect after countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = '/dashboard';
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6">
            Thank You for Your Support!
          </h1>
          
          <p className="text-xl text-gray-600 text-center mb-8">
            Your contribution helps us build a world where outbreaks are detected before they spread.
          </p>
          
          <div className="bg-green-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Your donation will help us:</h2>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-green-700">Expand our early warning system to more communities</span>
              </li>
              <li className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-green-700">Train more health workers on prevention strategies</span>
              </li>
              <li className="flex items-start space-x-3">
                <Heart className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-green-700">Save lives through early detection and intervention</span>
              </li>
            </ul>
          </div>
          
          <div className="text-center space-y-6">
            <p className="text-gray-600">
              A receipt has been sent to your email address. You'll be redirected to the dashboard in {countdown} seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                to="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccessPage;