import React from 'react';
import { Database, Brain, Bell, Users } from 'lucide-react';

const WhatWeDoSection = () => {
  const steps = [
    {
      icon: Database,
      title: 'Collect',
      description: 'Gather non-diagnostic, anonymized health signals from wearables, wastewater, pharmacy trends, and more.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'Analyze',
      description: 'Advanced AI detects abnormal clusters and patterns before traditional methods can identify them.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Bell,
      title: 'Alert',
      description: 'Real-time notifications and actionable alerts sent to communities and health professionals.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      title: 'Empower',
      description: 'Give communities, health teams, and policymakers early warning and precious time to act.',
      color: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transforming invisible signals into actionable alerts
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Prevora gathers non-diagnostic, anonymized health signals using advanced AI to detect 
            abnormal clusters before traditional methods, giving communities early warning and precious time to act.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0"></div>
              )}
              
              <div className="relative z-10 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;