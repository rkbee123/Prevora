import React from 'react';
import { Activity, Brain, Bell, Users, Smartphone, Droplets, Pill, Wind, Database, Zap, AlertTriangle, Shield } from 'lucide-react';

const WhatWeDoPage = () => {
  const steps = [
    {
      icon: Database,
      title: 'Collect',
      description: 'We gather real-world, anonymized signals: cough vibration data, wastewater viral loads, pharmacy trends, acoustic anomalies, wearable sensor data — all non-diagnostic, privacy-respecting inputs.',
      details: ['Wearables & Devices', 'Wastewater Analysis', 'Pharmacy Trends', 'Environmental Data']
    },
    {
      icon: Brain,
      title: 'Analyze',
      description: 'Our proprietary AI models process these streams in real time, spotting patterns and clustering anomalies that could hint at an emerging health event.',
      details: ['Pattern Recognition', 'Anomaly Detection', 'Cluster Analysis', 'Real-time Processing']
    },
    {
      icon: Bell,
      title: 'Alert',
      description: 'When the system detects unusual activity — a cluster of coughs in a district, a spike in wastewater viral signals — it triggers early warnings, visible on our dashboard.',
      details: ['Real-time Notifications', 'Dashboard Alerts', 'Community Warnings', 'Partner Integration']
    },
    {
      icon: Users,
      title: 'Empower',
      description: 'Healthcare workers, public health teams, NGOs and even everyday citizens can see where risk is rising and take preventive action — weeks before traditional systems.',
      details: ['Healthcare Teams', 'Public Health', 'Community Action', 'Early Intervention']
    }
  ];

  const signalTypes = [
    {
      icon: Smartphone,
      title: 'Wearables & Devices',
      description: 'Vibration sensors can detect cough frequency and intensity (without recording speech).',
      privacy: 'No speech recording, only vibration patterns'
    },
    {
      icon: Droplets,
      title: 'Wastewater',
      description: 'Community-level sampling spots viral traces early, before patients may even feel symptoms.',
      privacy: 'Community-level only, no individual tracking'
    },
    {
      icon: Pill,
      title: 'Pharmacy Trends',
      description: 'Rising purchases of fever or cough medication can be a subtle early clue.',
      privacy: 'Aggregated purchase data, anonymized'
    },
    {
      icon: Wind,
      title: 'Environmental & Acoustic',
      description: 'Noise patterns, air quality data, and even public cough sound anomalies help complete the picture.',
      privacy: 'Public space monitoring only'
    }
  ];

  const aiCapabilities = [
    'Cleans and validates data',
    'Detects outliers and trends',
    'Simulates possible outbreak scenarios',
    'Ranks clusters by severity and confidence',
    'Integrates expert review to reduce false alarms'
  ];

  const dashboardFeatures = [
    'Live map of potential outbreaks',
    'Timeline of signal trends',
    'Detailed event cards with anomaly scores',
    'Community alerts and recommended precautions',
    'Admin panel for data management'
  ];

  const impacts = [
    'Outbreaks are detected days or weeks earlier',
    'Communities can prepare medical resources',
    'Local alerts encourage preventive behavior',
    'Health systems avoid costly, late-stage interventions',
    'Every day saved can save countless lives'
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              We detect outbreaks <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">before they start</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Using real-time data, AI, and human insight, Prevora turns scattered health signals into life-saving early warnings — giving communities and health systems time to act.
            </p>
            <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg hover:shadow-2xl transition-all duration-300">
              Discover how it works
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">How Prevora Works</h2>
              <p className="text-xl text-gray-600">A comprehensive four-step process from data collection to community action</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {steps.map((step, index) => (
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
                          <step.icon className="h-6 w-6 text-blue-600" />
                          <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {step.details.map((detail, idx) => (
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
        </div>
      </section>

      {/* Signals We Collect */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Signals We Collect</h2>
              <p className="text-xl text-gray-600">All data is anonymized, aggregated, and used only to detect potential clusters — never to track individuals</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {signalTypes.map((signal, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                      <signal.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{signal.title}</h3>
                      <p className="text-gray-600 mb-4">{signal.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <Shield className="h-4 w-4" />
                        <span>{signal.privacy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI & Models */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">AI & Models</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our multi-layered AI pipeline combines machine speed with human expertise for accurate, reliable predictions.
                </p>
                <div className="space-y-4">
                  {aiCapabilities.map((capability, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <Zap className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700">{capability}</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-600 mt-6">
                  Each signal type is weighted differently; models are trained on real-world data to stay adaptive and robust.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
                <Brain className="h-16 w-16 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Advanced Analytics</h3>
                <p className="text-purple-100 mb-6">
                  Our AI doesn't just process data — it learns patterns, predicts trends, and adapts to new threats in real-time.
                </p>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm text-purple-100">
                    "We combine machine speed with human expertise to create the most reliable early warning system possible."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Early Warning Dashboard</h2>
              <p className="text-xl text-gray-600">Our secure, real-time dashboard provides comprehensive insights for all stakeholders</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">{feature}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-6">
                Individuals see signals near their area; health teams see aggregate data across regions.
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                View Dashboard Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Impact */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Real-World Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {impacts.map((impact, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-green-100">{impact}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">More Than Technology</h3>
              <p className="text-green-100 text-lg leading-relaxed">
                Prevora is a movement for proactive global health, a bridge between data science and real-world care, 
                built by students, doctors, engineers and volunteers. Together, we can make prevention the new normal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to join us?</h2>
          <p className="text-xl text-gray-600 mb-12">
            Be part of the prevention revolution and help us build a safer, healthier world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Join the Movement
            </button>
            <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
              See a Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatWeDoPage;