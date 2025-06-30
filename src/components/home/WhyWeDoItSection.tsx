import React from 'react';
import { Heart, Shield, Users } from 'lucide-react';
import DonateButton from '../DonateButton';

const WhyWeDoItSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/3844581/pexels-photo-3844581.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
        }}
      ></div>
      
      <div className="relative z-10 container mx-auto px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-full">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Building a safer world, before the next outbreak.
          </h2>
          
          <div className="space-y-6 text-lg md:text-xl leading-relaxed mb-12">
            <p className="text-blue-100">
              Outbreaks are costly, unpredictable — and often preventable.
            </p>
            <p className="text-blue-100">
              Prevora is built by passionate students, doctors, engineers and data scientists 
              who believe prevention should come before reaction.
            </p>
            <p className="text-blue-100">
              We dream of a world where a single early signal can help save thousands of lives.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20">
            <blockquote className="text-2xl font-medium text-blue-100 italic">
              "We can't stop every outbreak. But together, we can make sure no one is left unprepared."
            </blockquote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Shield className="h-8 w-8 text-blue-400 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Prevention First</h3>
              <p className="text-sm text-blue-100">Early detection saves lives and resources</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="h-8 w-8 text-purple-400 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Community Driven</h3>
              <p className="text-sm text-blue-100">Built by and for global health communities</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Heart className="h-8 w-8 text-pink-400 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Lives Matter</h3>
              <p className="text-sm text-blue-100">Every signal counts toward saving lives</p>
            </div>
          </div>

          <DonateButton className="px-8 py-4 text-lg" />
        </div>
      </div>
    </section>
  );
};

export default WhyWeDoItSection;