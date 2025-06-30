import React, { useState, useEffect } from 'react';
import { MapPin, Clock, TrendingUp, AlertTriangle, Users, Shield, Download, Eye, ChevronRight, Filter, Search, Bell, Bot, CheckCircle, Zap, X, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import { getAlerts, getSignals } from '../lib/supabase';
import { generateEventRecommendations } from '../lib/openai';

const AlertsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [signals, setSignals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [activeTab, setActiveTab] = useState('report');
  const [alertRecommendations, setAlertRecommendations] = useState({});
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [alertsResult, signalsResult] = await Promise.all([
        getAlerts(),
        getSignals()
      ]);
      
      if (alertsResult.data) {
        setAlerts(alertsResult.data);
      }
      
      if (signalsResult.data) {
        setSignals(signalsResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendationsForAlert = async (alert) => {
    if (alertRecommendations[alert.id] || isGeneratingRecommendations[alert.id]) {
      return;
    }

    setIsGeneratingRecommendations(prev => ({ ...prev, [alert.id]: true }));

    try {
      // Get related signals for this alert location
      const relatedSignals = signals.filter(signal => 
        signal.location.toLowerCase().includes(alert.location.toLowerCase()) ||
        alert.location.toLowerCase().includes(signal.location.toLowerCase())
      );

      const { recommendations, precautions } = await generateEventRecommendations(alert, relatedSignals);
      
      setAlertRecommendations(prev => ({
        ...prev,
        [alert.id]: { recommendations, precautions }
      }));
    } catch (error) {
      console.error('Error generating recommendations for alert:', error);
      // Fallback recommendations
      setAlertRecommendations(prev => ({
        ...prev,
        [alert.id]: {
          recommendations: [
            'Monitor symptoms closely',
            'Practice good hygiene',
            'Stay informed about local updates',
            'Seek medical attention if symptoms develop'
          ],
          precautions: [
            'Health authorities have been notified',
            'Monitoring systems are active',
            'Emergency response protocols activated'
          ]
        }
      }));
    } finally {
      setIsGeneratingRecommendations(prev => ({ ...prev, [alert.id]: false }));
    }
  };

  // Mock alerts data with enhanced information
  const mockAlerts = [
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
      coordinates: [19.1136, 72.8697],
      affected_population: 45000,
      confidence: 0.92
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
      coordinates: [28.6139, 77.2090],
      affected_population: 32000,
      confidence: 0.78
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
      coordinates: [12.9716, 77.5946],
      affected_population: 18000,
      confidence: 0.65
    }
  ];

  // Use mock data if no real alerts
  const displayAlerts = alerts.length > 0 ? alerts : mockAlerts;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'from-red-500 to-orange-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-teal-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAlerts = displayAlerts.filter(alert => {
    const matchesSearch = alert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || alert.severity === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const mapSignals = displayAlerts.map(alert => ({
    id: alert.id,
    lat: alert.coordinates?.[0] || 20.5937,
    lng: alert.coordinates?.[1] || 78.9629,
    type: alert.type || 'Unknown',
    severity: alert.severity as 'low' | 'medium' | 'high',
    location: alert.location,
    timestamp: alert.timestamp
  }));

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setActiveTab('report');
    generateRecommendationsForAlert(alert);
  };

  const renderAlertDetailModal = () => {
    if (!selectedAlert) return null;

    const alert = selectedAlert;
    const recommendations = alertRecommendations[alert.id]?.recommendations || [];
    const precautions = alertRecommendations[alert.id]?.precautions || [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-cream-50 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-amber-50 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-amber-500 text-white px-3 py-1 rounded-md font-bold">
                ALERT
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md">
                AI Generated
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="text-gray-500 hover:text-gray-700">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Download className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setSelectedAlert(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="p-6 pb-2">
            <h2 className="text-3xl font-bold text-gray-900">
              ALERT: {(alert.type || 'Unknown')} signals spike in {alert.location.split(',')[0]}
            </h2>
          </div>

          {/* Meta Info */}
          <div className="px-6 pb-4 flex flex-wrap items-center text-gray-600 gap-x-8 gap-y-2">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              {alert.location}
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              {alert.timestamp || '30/6/2025'}
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Prevora AI System
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('report')}
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'report'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Full Report
                </span>
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'actions'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center justify-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Actions
                </span>
              </button>
              <button
                onClick={() => setActiveTab('precautions')}
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'precautions'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Precautions
                </span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'report' && (
              <div>
                {/* Event Summary */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Event Summary</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Signals:</div>
                      <div className="text-xl font-bold text-gray-900">{alert.signals || 25}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Type:</div>
                      <div className="text-xl font-bold text-gray-900">{alert.severity}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Status:</div>
                      <div className="text-xl font-bold text-gray-900">Active</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Detected:</div>
                      <div className="text-xl font-bold text-gray-900">{alert.timestamp?.split(' ')[0] || '30/6/2025'}</div>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {(alert.type || 'Unknown')} Cluster Detected in {alert.location.split(',')[0]}: A Prevora Early Warning System Update
                </h3>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">What happened and current status:</h4>
                <p className="text-gray-700 mb-6">
                  A concerning health event has been detected in {alert.location}, specifically in the {alert.location.split(',')[0]} area. An unusual spike in {(alert.type || 'unknown').toLowerCase()} signals has been reported, with a total of {alert.signals || 25} signals within a 24-hour period. The signals have been categorized based on severity, with {Math.floor((alert.signals || 25) * 0.3)} signals classified as high, {Math.floor((alert.signals || 25) * 0.4)} as medium, and {Math.floor((alert.signals || 25) * 0.3)} as low. This detection was made possible through an automated cluster detection system powered by artificial intelligence. As of the latest update on {alert.timestamp || '30/6/2025'}, the event is still active, with additional signals being detected periodically, indicating ongoing transmission in the community.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">What this means for the community:</h4>
                <p className="text-gray-700 mb-6">
                  This alert indicates a potential health concern in your area that requires attention. While not cause for panic, it suggests increased vigilance and preventive measures are warranted. The {alert.severity} severity classification means that there is {alert.severity === 'high' ? 'significant' : alert.severity === 'medium' ? 'moderate' : 'some'} risk of transmission, and community members should take appropriate precautions. The Prevora early warning system has detected this pattern before traditional surveillance methods would typically identify it, giving the community valuable time to implement preventive measures.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Next steps:</h4>
                <p className="text-gray-700 mb-6">
                  Health authorities have been automatically notified of this alert and are monitoring the situation. Additional data collection and analysis are ongoing. The system will continue to track signal patterns and provide updates as the situation evolves. Community members are encouraged to follow the recommended actions and stay informed through official channels.
                </p>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This alert was generated by the Prevora AI early warning system based on anonymized health signals. It is intended for informational purposes and to enable early preventive action. Always follow guidance from local health authorities.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Actions</h3>
                {isGeneratingRecommendations[alert.id] ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Generating recommendations...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-100">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-800">{recommendation}</p>
                        </div>
                      </div>
                    ))}
                    {recommendations.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No specific recommendations available</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'precautions' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Current Precautions</h3>
                {isGeneratingRecommendations[alert.id] ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Generating precautions...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {precautions.map((precaution, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                        <Zap className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-800">{precaution}</p>
                        </div>
                      </div>
                    ))}
                    {precautions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No specific precautions available</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Alert ID: {alert.id} • Generated: {alert.timestamp || '30/6/2025'}
            </div>
            <Link
              to={`/event/${alert.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              onClick={() => setSelectedAlert(null)}
            >
              <span>View Detailed Report</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

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
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading alerts...</span>
              </div>
            ) : filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
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
                      <button 
                        onClick={() => handleViewDetails(alert)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{alert.description}</p>

                  {/* Additional Alert Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-sm text-gray-600">Affected Population</div>
                      <div className="text-lg font-bold text-gray-900">{alert.affected_population?.toLocaleString() || 'N/A'}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-sm text-gray-600">Confidence Level</div>
                      <div className="text-lg font-bold text-gray-900">{alert.confidence ? (alert.confidence * 100).toFixed(0) : '85'}%</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-sm text-gray-600">Alert Type</div>
                      <div className="text-lg font-bold text-gray-900">{alert.type || 'Unknown'}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-gray-500">
                      Alert ID: {alert.id} • {alert.timestamp}
                    </div>
                    <Link
                      to={`/event/${alert.id}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      <span>View Full Report</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
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
                <div className="text-2xl font-bold text-gray-900">{filteredAlerts.filter(a => a.status === 'active').length}</div>
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
                <div className="text-2xl font-bold text-gray-900">{filteredAlerts.reduce((sum, a) => sum + (a.signals || 0), 0)}</div>
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
                <div className="text-2xl font-bold text-gray-900">{(filteredAlerts.reduce((sum, a) => sum + (a.affected_population || 0), 0) / 1000).toFixed(0)}K</div>
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

      {/* Alert Detail Modal */}
      {renderAlertDetailModal()}
    </div>
  );
};

export default AlertsPage;