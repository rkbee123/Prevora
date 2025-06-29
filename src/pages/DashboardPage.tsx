import React, { useState } from 'react';
import { Search, Bell, Settings, User, MapPin, TrendingUp, AlertTriangle, Calendar, Filter, Bot, Activity, Zap, Shield, Clock, ChevronRight, Eye, Download, BarChart3, Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import MapComponent from '../components/MapComponent';

const DashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState('2025-06-28');
  const [timeFilter, setTimeFilter] = useState('24h');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);

  const metricCards = [
    {
      title: 'Total Active Signals',
      value: '142',
      change: '+5%',
      trend: 'up',
      description: 'Signals detected in the last 24h',
      icon: Activity
    },
    {
      title: 'New Events This Week',
      value: '12',
      change: '+2',
      trend: 'up',
      description: 'Cluster events generated',
      icon: AlertTriangle
    },
    {
      title: 'Average Severity',
      value: 'Moderate',
      change: 'Stable',
      trend: 'stable',
      description: 'Across all active events',
      icon: BarChart3
    },
    {
      title: 'Signals Under Investigation',
      value: '4',
      change: '-1',
      trend: 'down',
      description: 'Requiring expert review',
      icon: Eye
    }
  ];

  const activeEvents = [
    {
      id: 34,
      title: 'Cough cluster detected – Mumbai, Andheri',
      location: 'Andheri West, Mumbai',
      type: 'Cough Spike',
      severity: 'high',
      signals: 21,
      timeAgo: '2 hours ago',
      description: 'Unusual spike in cough-related vibration signals detected via wearables',
      coordinates: [19.1136, 72.8697]
    },
    {
      id: 35,
      title: 'Wastewater viral traces – Delhi Central',
      location: 'Central District, Delhi',
      type: 'Wastewater',
      severity: 'medium',
      signals: 15,
      timeAgo: '6 hours ago',
      description: 'Moderate increase in viral load detected in community sampling',
      coordinates: [28.6139, 77.2090]
    },
    {
      id: 36,
      title: 'Pharmacy trend anomaly – Bangalore',
      location: 'Tech Corridor, Bangalore',
      type: 'Pharmacy',
      severity: 'low',
      signals: 8,
      timeAgo: '12 hours ago',
      description: 'Rise in fever medication purchases across major pharmacy chains',
      coordinates: [12.9716, 77.5946]
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'New cough signal from Mumbai',
      time: '5 minutes ago',
      type: 'signal',
      user: 'System',
      icon: Activity
    },
    {
      id: 2,
      action: 'Event cluster auto-generated',
      time: '1 hour ago',
      type: 'event',
      user: 'AI Engine',
      icon: Zap
    },
    {
      id: 3,
      action: 'Admin note added to event #34',
      time: '2 hours ago',
      type: 'note',
      user: 'Dr. Abraham',
      icon: User
    },
    {
      id: 4,
      action: 'Weekly report generated',
      time: '1 day ago',
      type: 'report',
      user: 'System',
      icon: BarChart3
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const mapSignals = activeEvents.map(event => ({
    id: event.id.toString(),
    lat: event.coordinates[0],
    lng: event.coordinates[1],
    type: event.type,
    severity: event.severity as 'low' | 'medium' | 'high',
    location: event.location,
    timestamp: event.timeAgo
  }));

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left - Greeting */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Good Morning, Abraham</h1>
              <p className="text-gray-600 text-sm sm:text-base">Here's an overview of recent disease signals and clusters detected.</p>
            </div>

            {/* Right - Search and Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by city, event, signal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Link 
                  to="/alerts"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </Link>
                
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Settings className="h-6 w-6" />
                </button>
                
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900 hidden sm:inline">Dr. Abraham</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
              {['24H', 'Weekly', 'Monthly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeFilter(period.toLowerCase())}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeFilter === period.toLowerCase()
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <RefreshCw className="h-5 w-5" />
            </button>
            <button className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Generate Report</span>
              <span className="sm:hidden">Report</span>
            </button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Map */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Live Signal Map</h2>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium">
                    Signals
                  </button>
                  <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
                    Events
                  </button>
                  <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
                    Clusters
                  </button>
                </div>
              </div>
              
              {/* Map */}
              <div className="relative">
                <MapComponent 
                  signals={mapSignals}
                  height="400px"
                  center={[20.5937, 78.9629]}
                  zoom={5}
                  className="z-0"
                />
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">High Severity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Medium</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Low</span>
                  </div>
                </div>
                <button className="text-blue-600 font-medium hover:text-blue-700 text-sm">
                  View Full Map →
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Metrics and Activity */}
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
              {metricCards.map((metric, index) => (
                <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{metric.title}</h3>
                    <metric.icon className={`h-4 w-4 ${getTrendColor(metric.trend)}`} />
                  </div>
                  <div className="flex items-end space-x-2 mb-1">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{metric.value}</span>
                    <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Recent Activity</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <activity.icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{activity.time}</span>
                        <span>•</span>
                        <span>{activity.user}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Active Events & Clusters</h2>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>All Severities</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Event</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 truncate">{event.location}</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.severity)} flex-shrink-0`}></div>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="font-medium">{event.signals} signals</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">{event.timeAgo}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Cluster #{event.id}</span>
                    <Link
                      to={`/event/${event.id}`}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Panel */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-red-900 mb-2">High Severity Alert</h3>
                <p className="text-red-800 mb-4">
                  High severity cough cluster in Bandra, Mumbai – monitor closely. Recommend increased precautionary measures in the affected area.
                </p>
                <Link
                  to="/event/34"
                  className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  View Full Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panpath AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setShowAIChat(!showAIChat)}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          <Bot className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        
        {showAIChat && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Panpath AI</h3>
              <button 
                onClick={() => setShowAIChat(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 mb-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-700">Hello! I can help you understand the current health signals. What would you like to know?</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                "Show me alerts near Mumbai"
              </button>
              <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                "Explain the latest cluster"
              </button>
              <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                "What's the risk level?"
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;