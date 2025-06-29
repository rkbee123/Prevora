import React, { useState } from 'react';
import { Users, Building, Heart, UserPlus, ArrowRight, Shield, Zap, Target, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import CalendarBooking from '../CalendarBooking';

const GetInvolvedSection = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  const involvementPaths = [
    {
      icon: Building,
      title: 'Contribute Data',
      subtitle: 'Organizations & Research Labs',
      description: 'Share anonymized health signals, research data, or infrastructure to strengthen our detection network.',
      benefits: ['Enhanced signal accuracy', 'Research collaboration', 'Early access to insights', 'Custom integration support'],
      cta: 'Partner with Data',
      color: 'from-blue-600 to-cyan-600',
      action: 'contact'
    },
    {
      icon: Users,
      title: 'Partner with Us',
      subtitle: 'NGOs, Universities, Health Departments',
      description: 'Join our mission as an institutional partner to deploy Prevora in your community or region.',
      benefits: ['Co-branded deployment', 'Training & support', 'Custom dashboards', 'Policy integration'],
      cta: 'Become a Partner',
      color: 'from-purple-600 to-pink-600',
      action: 'contact'
    },
    {
      icon: Heart,
      title: 'Support & Sponsor',
      subtitle: 'Donors & Investors',
      description: 'Fund the development and deployment of early warning systems that can save thousands of lives.',
      benefits: ['Tax-deductible donations', 'Impact reporting', 'Recognition programs', 'Advisory opportunities'],
      cta: 'Support Mission',
      color: 'from-green-600 to-teal-600',
      action: 'who-we-are'
    },
    {
      icon: UserPlus,
      title: 'Join as User',
      subtitle: 'Advocates & Early Adopters',
      description: 'Become an early user, advocate, or community ambassador to help spread prevention awareness.',
      benefits: ['Early platform access', 'Community leadership', 'Training materials', 'Referral rewards'],
      cta: 'Join Community',
      color: 'from-orange-600 to-red-600',
      action: 'who-we-are'
    }
  ];

  const stats = [
    { number: '50+', label: 'Research Partners', icon: Shield },
    { number: '1M+', label: 'Signals Processed', icon: Zap },
    { number: '25', label: 'Cities Protected', icon: Target },
    { number: '100K+', label: 'Lives Impacted', icon: Heart }
  ];

  const handlePathAction = (action: string) => {
    if (action === 'contact') {
      // Navigate to contact page
      window.location.href = '/contact';
    } else if (action === 'who-we-are') {
      // Navigate to who we are page
      window.location.href = '/who-we-are';
    }
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Prevention starts with <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">you</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Join our growing network of partners, contributors, and advocates working together to build 
                a safer, healthier world through early disease detection.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Involvement Paths */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {involvementPaths.map((path, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`p-3 bg-gradient-to-br ${path.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <path.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{path.title}</h3>
                      <p className="text-blue-600 font-medium">{path.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">{path.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What you get:</h4>
                    <ul className="space-y-2">
                      {path.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-gray-600 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => handlePathAction(path.action)}
                    className={`w-full px-6 py-3 bg-gradient-to-r ${path.color} text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2`}
                  >
                    <span>{path.cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Community Testimonial */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <blockquote className="text-2xl font-medium mb-4 italic">
                    "Prevora's early warning system helped our hospital prepare for a respiratory outbreak 
                    two weeks before it would have been detected through traditional methods."
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Dr. Sarah Chen</p>
                      <p className="text-blue-100">Chief Medical Officer, Metro Health</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="font-bold mb-4">Ready to make an impact?</h4>
                  <p className="text-blue-100 mb-4">
                    Join over 50 organizations already using Prevora to protect their communities.
                  </p>
                  <button 
                    onClick={() => setShowCalendar(true)}
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Schedule a Call
                  </button>
                </div>
              </div>
            </div>

            {/* Main CTAs */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to join the prevention revolution?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/who-we-are"
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Users className="h-5 w-5" />
                  <span>Join Us</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <Play className="h-5 w-5" />
                  <span>See a Demo</span>
                </Link>
              </div>
              
              <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
                Every partnership, every data point, every voice matters. Together, we can detect outbreaks 
                before they spread and save countless lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CalendarBooking isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
    </>
  );
};

export default GetInvolvedSection;