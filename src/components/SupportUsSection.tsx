import React from 'react';
import { Heart, Shield, Users, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DonateButton from './DonateButton';
import { products, formatCurrency } from '../stripe-config';

const SupportUsSection = () => {
  const donationProduct = products[0];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Support Our <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Mission</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your contribution helps us expand our early warning system, save more lives, and build a world better prepared for health challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Donation Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">One-Time Donation</h3>
                <p className="text-red-100">Help us detect outbreaks before they spread</p>
              </div>
              
              <div className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {formatCurrency(donationProduct.price, donationProduct.currency)}
                  </div>
                  <p className="text-gray-600">One-time contribution</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  {donationProduct.features?.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <DonateButton className="w-full" buttonText="Donate Now" />
              </div>
            </div>
            
            {/* Right: Impact Information */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Impact</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Protect Communities</h4>
                    <p className="text-gray-600">Your donation helps expand our early warning network to more communities, especially in vulnerable regions.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Accelerate Research</h4>
                    <p className="text-gray-600">Fund cutting-edge AI research to improve detection speed and accuracy, giving communities more time to prepare.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Build Global Resilience</h4>
                    <p className="text-gray-600">Help create a world where no community is caught unprepared by preventable disease outbreaks.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h4 className="font-semibold text-gray-900 mb-3">Other Ways to Support</h4>
                <p className="text-gray-600 mb-4">
                  Beyond financial contributions, you can help by spreading awareness, contributing data, or partnering with us.
                </p>
                <Link
                  to="/contact"
                  className="flex items-center text-blue-600 font-medium hover:text-blue-700"
                >
                  <span>Learn more about partnerships</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportUsSection;