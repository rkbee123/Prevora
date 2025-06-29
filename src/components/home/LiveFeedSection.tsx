import React from 'react';
import { MapPin, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

const LiveFeedSection = () => {
  const feedItems = [
    {
      id: 1,
      location: 'Mumbai, Andheri West',
      type: 'Cough Events',
      change: '+12%',
      timeframe: '24h',
      severity: 'medium',
      description: 'Increase in cough events detected via wearable sensors',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      location: 'Delhi, Central District',
      type: 'Wastewater Signals',
      change: '+8%',
      timeframe: '48h',
      severity: 'low',
      description: 'Slight uptick in viral load detected in wastewater sampling',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      location: 'Bangalore, Tech Corridor',
      type: 'Pharmacy Trends',
      change: '+18%',
      timeframe: '72h',
      severity: 'high',
      description: 'Significant rise in fever medication purchases',
      timestamp: '6 hours ago'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'from-red-500 to-orange-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-teal-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Early signals, real impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Live monitoring of health signals across communities, 
            turning data into actionable insights for early intervention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedItems.map((item) => (
            <div 
              key={item.id} 
              className={`${getSeverityBg(item.severity)} rounded-2xl p-6 border-2 hover:shadow-lg transition-all duration-300 group hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">{item.location}</span>
                </div>
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getSeverityColor(item.severity)} text-white text-xs font-semibold uppercase`}>
                  {item.severity}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.type}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-2xl text-gray-900">{item.change}</span>
                  <span className="text-gray-500 text-sm">over {item.timeframe}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{item.timestamp}</span>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
            View All Signals
          </button>
        </div>
      </div>
    </section>
  );
};

export default LiveFeedSection;