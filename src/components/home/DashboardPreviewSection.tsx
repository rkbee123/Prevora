import React from 'react';
import { BarChart3, MapPin, TrendingUp, AlertTriangle, Activity, Clock, Users, Shield, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardPreviewSectionProps {
  onOpenAuth: (mode: 'login' | 'signup' | 'admin') => void;
}

const DashboardPreviewSection: React.FC<DashboardPreviewSectionProps> = ({ onOpenAuth }) => {
  const dashboardFeatures = [
    {
      icon: MapPin,
      title: 'Live Map',
      description: 'Real-time signal plotting with severity indicators'
    },
    {
      icon: BarChart3,
      title: 'Trend Analytics',
      description: 'Advanced charts showing signal patterns over time'
    },
    {
      icon: AlertTriangle,
      title: 'Smart Alerts',
      description: 'Automated notifications for emerging clusters'
    },
    {
      icon: Activity,
      title: 'Signal Feed',
      description: 'Live stream of incoming health signals'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Interactive, data-rich, yet <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">simple</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Live map, search by location, event feed, trend graphs, admin upload interface — 
              everything designed for clarity and action.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Dashboard Preview */}
            <div className="relative">
              <div className="bg-gray-900 rounded-2xl p-4 md:p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white font-semibold">Prevora Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-400 text-sm">Live</span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-gray-800 rounded-lg p-3 md:p-4">
                      <div className="text-blue-400 text-lg md:text-2xl font-bold">142</div>
                      <div className="text-gray-400 text-xs">Active Signals</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 md:p-4">
                      <div className="text-yellow-400 text-lg md:text-2xl font-bold">12</div>
                      <div className="text-gray-400 text-xs">New Events</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 md:p-4">
                      <div className="text-green-400 text-sm md:text-xl font-bold">Moderate</div>
                      <div className="text-gray-400 text-xs">Avg Severity</div>
                    </div>
                  </div>

                  {/* Map Area */}
                  <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-4 h-24 md:h-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%236366f1%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2215%22 cy=%2215%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
                    <div className="absolute top-1/4 left-1/3 w-2 md:w-3 h-2 md:h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/2 right-1/4 w-1.5 md:w-2 h-1.5 md:h-2 bg-yellow-500 rounded-full animate-ping"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-3 md:w-4 h-3 md:h-4 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="flex items-center justify-center h-full">
                      <MapPin className="h-6 md:h-8 w-6 md:w-8 text-blue-400 opacity-60" />
                    </div>
                  </div>

                  {/* Event List */}
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between p-2 md:p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div>
                          <div className="text-white text-xs md:text-sm font-medium">Mumbai Cough Cluster</div>
                          <div className="text-gray-400 text-xs">21 signals • 2h ago</div>
                        </div>
                      </div>
                      <div className="text-red-400 text-xs">HIGH</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 md:p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div>
                          <div className="text-white text-xs md:text-sm font-medium">Delhi Wastewater Alert</div>
                          <div className="text-gray-400 text-xs">15 signals • 6h ago</div>
                        </div>
                      </div>
                      <div className="text-yellow-400 text-xs">MED</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-2 md:-top-4 -right-2 md:-right-4 bg-green-500 text-white p-2 rounded-lg shadow-lg animate-bounce">
                <div className="text-xs font-bold">New Signal</div>
              </div>
              
              <div className="absolute -bottom-2 md:-bottom-4 -left-2 md:-left-4 bg-blue-600 text-white p-2 md:p-3 rounded-lg shadow-lg">
                <TrendingUp className="h-3 md:h-4 w-3 md:w-4" />
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Powerful features, intuitive design</h3>
                <p className="text-gray-600 mb-8">
                  Our dashboard puts the power of early disease detection at your fingertips. 
                  Monitor signals, track trends, and take action — all from one comprehensive interface.
                </p>
              </div>

              <div className="space-y-6">
                {dashboardFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Multi-user Access</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Different views for different users: citizens see local alerts, health officials get regional insights, 
                  and researchers access comprehensive data analytics.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Citizens</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Health Officials</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Researchers</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="flex-1 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-center"
                >
                  Explore the Dashboard
                </Link>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="flex-1 px-6 md:px-8 py-3 md:py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Get Started</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;