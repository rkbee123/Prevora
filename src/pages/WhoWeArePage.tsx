import React from 'react';
import { Shield, Heart, Users, Globe, Lock, Zap, Target, UserCheck } from 'lucide-react';

const WhoWeArePage = () => {
  const values = [
    {
      icon: Lock,
      title: 'Privacy-first',
      description: 'Always anonymized, never personal'
    },
    {
      icon: Globe,
      title: 'Transparency',
      description: 'Open science, clear methods'
    },
    {
      icon: Zap,
      title: 'Speed & precision',
      description: 'Early warnings matter'
    },
    {
      icon: Heart,
      title: 'Global impact',
      description: 'Designed to help anyone, anywhere'
    }
  ];

  const teamRoles = [
    { role: 'Doctors and public health researchers', icon: Heart },
    { role: 'AI & data engineers', icon: Zap },
    { role: 'Designers and product builders', icon: Target },
    { role: 'Students and volunteers', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                <Shield className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              We're <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Prevora</span>
            </h1>
            <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
              Building the world's first AI-driven early disease prevention network.
            </p>
            <p className="text-xl text-gray-700 mb-12">
              Our mission is simple yet powerful: detect health threats before they become outbreaks — and protect communities worldwide.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300">
              Become part of our journey
            </button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    At Prevora, we believe prevention is the best cure. Using real-time signals — from cough sounds, 
                    wastewater, wearables, and digital health data — we build an AI-powered shield against emerging health risks.
                  </p>
                  <p>
                    Our mission is to spot anomalies, cluster early warnings, and deliver life-saving insights — before diseases spread.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <Target className="h-12 w-12 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Prevention First</h3>
                <p className="text-blue-100">
                  In the fight against global diseases, speed saves lives. We're creating technology that gives communities 
                  the early warnings they need to act before it's too late.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Prevora began as an ambitious idea by a team of medical students, AI engineers, and epidemiology researchers 
                who saw a simple truth: <strong>In the fight against global diseases, speed saves lives.</strong>
              </p>
              <p>
                Inspired by the gaps revealed during recent health crises, we imagined a platform that combines advanced AI, 
                community-sourced data, and real-world signals — to predict outbreaks early and save lives.
              </p>
              <p>
                What started as a hackathon project is now becoming a product that could protect millions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Why It Matters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-2xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Lives & Resources</h3>
                <p className="text-gray-600 text-sm">Outbreaks cost lives and billions → faster detection means fewer tragedies</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-2xl">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Data Exists</h3>
                <p className="text-gray-600 text-sm">Data already exists → we bring it together, clean it, and act on it</p>
              </div>
              <div className="text-center p-6 bg-teal-50 rounded-2xl">
                <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">AI Intelligence</h3>
                <p className="text-gray-600 text-sm">AI makes sense of complexity → turning scattered signals into actionable warnings</p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-2xl">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Community Power</h3>
                <p className="text-gray-600 text-sm">Community matters → our network grows smarter as more people join</p>
              </div>
            </div>
            <div className="text-center mt-12">
              <p className="text-xl text-gray-700 font-medium">
                Prevora isn't just a product. It's a global movement for proactive health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Who We Are</h2>
            <p className="text-xl text-blue-100 mb-12">
              We're a diverse team united by one goal: a healthier, safer world
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {teamRoles.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-medium">{item.role}</span>
                </div>
              ))}
            </div>
            <p className="text-blue-100 text-lg">
              Together, we build, test, and improve Prevora every day — because we believe prevention should be proactive, not reactive.
            </p>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">How We Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Signals</h3>
                <p className="text-gray-600 text-sm">Collect anonymized, non-diagnostic real-world data</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">AI Models</h3>
                <p className="text-gray-600 text-sm">Identify clusters, trends & anomalies in real time</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Dashboard</h3>
                <p className="text-gray-600 text-sm">Visualize outbreaks before they happen</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Human Insight</h3>
                <p className="text-gray-600 text-sm">Experts verify and communicate insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Us</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            We're still growing — and we need researchers, developers, hospitals & clinics, NGOs, government agencies, volunteers & donors.
          </p>
          <p className="text-lg text-blue-100 mb-12">
            Together, we can build a world that's always one step ahead.
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300">
            Join the Movement
          </button>
        </div>
      </section>
    </div>
  );
};

export default WhoWeArePage;