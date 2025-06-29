import React from 'react';
import { Activity, Zap, Map, Shield } from 'lucide-react';

const HowItWorksSection = () => {
  const features = [
    {
      icon: Activity,
      title: 'Collect signals',
      description: 'Cough vibration sensors (privacy-first, no speech recording), wastewater viral load, pharmacy purchase trends, acoustic anomalies & syndromic data.',
      details: ['Privacy-first sensors', 'Wastewater analysis', 'Pharmacy trends', 'Acoustic monitoring']
    },
    {
      icon: Zap,
      title: 'AI & models',
      description: 'Clean, validate and detect abnormal patterns; simulate clusters; reduce false positives.',
      details: ['Pattern recognition', 'Cluster simulation', 'False positive reduction', 'Real-time processing']
    },
    {
      icon: Map,
      title: 'Real-time alerts',
      description: 'Interactive dashboard, live map, detailed event cards, recommended precautions.',
      details: ['Interactive dashboard', 'Live mapping', 'Event tracking', 'Actionable recommendations']
    },
    {
      icon: Shield,
      title: 'Community action',
      description: 'Hospitals, health authorities and even citizens see risk early and act.',
      details: ['Hospital networks', 'Health authorities', 'Citizen alerts', 'Early intervention']
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            A multi-layered early warning system
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive approach combines multiple data sources with advanced AI 
            to create the most reliable early warning system for disease outbreaks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                      <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {feature.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-sm text-gray-600">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;