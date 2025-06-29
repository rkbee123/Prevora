import React, { useState } from 'react';
import { AlertTriangle, MapPin, Clock, Filter, Search, Bell, TrendingUp, Users, Shield, Download, Eye, ChevronRight } from 'lucide-react';
import MapComponent from '../components/MapComponent';

const AlertsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const alerts = [
    {
      id: 'ALT-001',
      title: 'High Cough Cluster - Mumbai Andheri',
      location: 'Andheri West, Mumbai',
      type: 'Respiratory',
      severity: 'high',
      status: 'active',
      signals: 21,
      timeAgo: '2 hours ago',
      timestamp: '2025-06-28 10:32 AM',
      description: 'Unusual spike in cough-related vibration signals detected via wearables and acoustic monitors.',
      recommendations: [
        'Wear masks in crowded areas',
        'Avoid unnecessary travel to affected areas',
        'Monitor symptoms closely',
        'Seek medical attention if symptoms develop'
      ],
      coordinates: [19.1136, 72.8697]
    },
    {
      id: 'ALT-002',
      title: 'Wastewater Viral Traces - Delhi Central',
      location: 'Central District, Delhi',
      type: 'Wastewater',
      severity: 'medium',
      status: 'active',
      signals: 15,
      timeAgo: '6 hours ago',
      timestamp: '2025-06-28 06:15 AM',
      description: 'Moderate increase in viral load detected in community wastewater sampling.',
      recommendations: [
        'Practice good hand hygiene',
        'Ensure proper sanitation',
        'Stay hydrated',
        'Monitor local health advisories'
      ],
      coordinates: [28.6139, 77.2090]
    },
    {
      id: 'ALT-003',
      title: 'Pharmacy Trend Anomaly - Bangalore',
      location: 'Tech Corridor, Bangalore',
      type: 'Pharmacy',
      severity: 'low',
      status: 'monitoring',
      signals: 8,
      timeAgo: '12 hours ago',
      timestamp: '2025-06-27 22:30 PM',
      description: 'Rise in fever medication purchases across major pharmacy chains.',
      recommendations: [
        'Stay informed about local health updates',
        'Maintain general health precautions',
        'Report symptoms to healthcare providers',
        'Follow standard prevention protocols'
      ],
      coordinates: [12.9716, 77.5946]
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || alert.severity === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const mapSignals = alerts.map(alert => ({
    id: alert.id,
    lat: alert.coordinates[0],
    lng: alert.coordinates[1],
    type: alert.type,
    severity: alert.severity as 'low' | 'medium' | 'high',
    location: alert.location,
    timestamp: alert.timestamp
  }));

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <span>Health Alerts</span>
              </h1>
              <p className="text-gray-600 mt-2">Real-time health alerts and early warning notifications</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Subscribe</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alerts by location or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>{filteredAlerts.length} alerts found</span>
            </div>
          </div>
        </div>

        {/* Map and Alerts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Map */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Alert Locations</span>
              </h3>
              <MapComponent 
                signals={mapSignals}
                height="400px"
                center={[20.5937, 78.9629]} // India center
                zoom={5}
              />
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">High</span>
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
              </div>
            </div>
          </div>

          {/* Alerts List */}
          <div className="xl:col-span-2 space-y-6">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className={`${getSeverityBg(alert.severity)} rounded-xl p-6 border-2 hover:shadow-xl transition-all duration-300 group`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getSeverityColor(alert.severity)} text-white text-xs font-semibold uppercase`}>
                        {alert.severity}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {alert.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{alert.timeAgo}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{alert.signals} signals</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{alert.description}</p>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommended Actions:</h4>
                  <ul className="space-y-1">
                    {alert.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Alert ID: {alert.id} • {alert.timestamp}
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="text-center py-16">
                <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No alerts found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">Active Alerts</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">44</div>
                <div className="text-sm text-gray-600">Total Signals</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">1.2M</div>
                <div className="text-sm text-gray-600">People Notified</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;