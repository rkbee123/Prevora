import React from 'react';
import { Heart, Shield, Users, Zap, ArrowRight, Globe, Building, Briefcase, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import DonateButton from '../components/DonateButton';
import { products, formatCurrency } from '../stripe-config';

const SupportPage = () => {
  const donationProduct = products[0];

  const supportOptions = [
    {
      icon: Gift,
      title: 'One-Time Donation',
      description: 'Make a direct contribution to support our mission',
      action: 'donate'
    },
    {
      icon: Building,
      title: 'Corporate Partnership',
      description: 'Engage your organization in our prevention network',
      action: 'contact'
    },
    {
      icon: Globe,
      title: 'Data Contribution',
      description: 'Share anonymized health data to improve our models',
      action: 'contact'
    },
    {
      icon: Briefcase,
      title: 'Professional Expertise',
      description: 'Volunteer your skills to help us grow',
      action: 'contact'
    }
  ];

  const impactStats = [
    { number: '14h', label: 'Earlier Detection', description: 'Average lead time before traditional methods' },
    { number: '50+', label: 'Communities Protected', description: 'Locations with active monitoring' },
    { number: '92%', label: 'Detection Accuracy', description: 'Validated against historical data' },
    { number: '100K+', label: 'Potential Lives Saved', description: 'Through early intervention' }
  ];

  const handleSupportAction = (action: string) => {
    if (action === 'donate') {
      // Scroll to donation form
      document.getElementById('donation-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'contact') {
      // Navigate to contact page
      window.location.href = '/contact';
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mb-6">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Support Our <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Mission</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join us in building a world where outbreaks are detected before they spread. Your support makes our early warning system possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#donation-section"
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300"
              >
                Donate Now
              </a>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Other Ways to Help
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="font-semibold text-gray-800 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ways to Support
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                There are many ways to contribute to our mission. Choose the option that works best for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {supportOptions.map((option, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl mb-6">
                    <option.icon className="h-8 w-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{option.title}</h3>
                  <p className="text-gray-600 mb-6">{option.description}</p>
                  <button
                    onClick={() => handleSupportAction(option.action)}
                    className="flex items-center text-pink-600 font-medium hover:text-pink-700"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section id="donation-section" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Donation Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Make a Donation</h3>
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
                  
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Secure payment processing via Stripe. Your financial information is never stored on our servers.
                  </p>
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
                  <h4 className="font-semibold text-gray-900 mb-3">Transparency Promise</h4>
                  <p className="text-gray-600 mb-4">
                    We're committed to transparency in how we use donations. 85% of all contributions go directly to our prevention programs, with 15% supporting essential operations.
                  </p>
                  <Link
                    to="/who-we-are"
                    className="flex items-center text-blue-600 font-medium hover:text-blue-700"
                  >
                    <span>Learn more about our organization</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="h-12 w-12 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-medium mb-8">
              "Every contribution, no matter the size, brings us one step closer to a world where preventable outbreaks no longer claim lives."
            </blockquote>
            <p className="text-xl">
              Join us in building a safer future for all communities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;