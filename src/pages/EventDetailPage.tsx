import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, TrendingUp, AlertTriangle, Users, Shield, Download, Share2, Eye, Calendar, Activity, BarChart3, Bot } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { getEventById, getSignals } from '../lib/supabase';

const EventDetailPage = () => {
  const { id } = useParams();
  const [showAIChat, setShowAIChat] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [relatedSignals, setRelatedSignals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEventData();
  }, [id]);

  const loadEventData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      // Try to get event from database first
      const { data: dbEvent } = await getEventById(id);
      
      if (dbEvent) {
        setEventData(dbEvent);
        
        // Load related signals
        const { data: signals } = await getSignals({ location: dbEvent.location });
        setRelatedSignals(signals || []);
      } else {
        // Fallback to mock data for demo
        setEventData(getMockEventData(id));
        setRelatedSignals([]);
      }
    } catch (error) {
      console.error('Error loading event data:', error);
      // Use mock data as fallback
      setEventData(getMockEventData(id));
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for demo purposes
  const getMockEventData = (eventId: string) => ({
    id: eventId,
    title: 'Cough cluster detected – Mumbai, Andheri',
    location: 'Andheri West, Mumbai',
    event_type: 'Respiratory',
    severity: 'high',
    status: 'active',
    signal_count: 21,
    description: 'Unusual spike in cough-related vibration signals detected via wearables and acoustic monitors in Mumbai\'s Andheri West area.',
    created_at: '2025-06-28T10:32:00Z',
    coordinates: [19.1136, 72.8697],
    anomaly_score: 0.87,
    confidence: 0.92,
    affected_population: 45000,
    recommendations: [
      'Wear masks in crowded indoor areas',
      'Avoid unnecessary travel to affected areas',
      'Monitor symptoms closely and seek medical attention if needed',
      'Ensure good ventilation in indoor spaces',
      'Practice frequent hand hygiene',
      'Stay home if experiencing respiratory symptoms'
    ],
    precautions: [
      'Local hospitals have been notified and are on alert',
      'Health authorities are monitoring the situation',
      'Additional testing facilities have been set up',
      'Public health advisories have been issued'
    ],
    timeline: [
      { time: '10:32 AM', event: 'Initial cluster detected', severity: 'medium' },
      { time: '11:15 AM', event: 'Severity upgraded to high', severity: 'high' },
      { time: '11:45 AM', event: 'Health authorities notified', severity: 'high' },
      { time: '12:30 PM', event: 'Public alert issued', severity: 'high' }
    ],
    signalTrend: [
      { time: '06:00', signals: 2, anomaly: 0.1 },
      { time: '07:00', signals: 3, anomaly: 0.15 },
      { time: '08:00', signals: 5, anomaly: 0.25 },
      { time: '09:00', signals: 8, anomaly: 0.4 },
      { time: '10:00', signals: 15, anomaly: 0.7 },
      { time: '11:00', signals: 21, anomaly: 0.87 },
      { time: '12:00', signals: 19, anomaly: 0.82 }
    ],
    severityDistribution: [
      { severity: 'Low', count: 5, color: '#10b981' },
      { severity: 'Medium', count: 8, color: '#f59e0b' },
      { severity: 'High', count: 8, color: '#ef4444' }
    ]
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const mapSignals = relatedSignals.length > 0 
    ? relatedSignals.map(signal => ({
        id: signal.id,
        lat: signal.latitude || eventData.coordinates?.[0] || 20.5937,
        lng: signal.longitude || eventData.coordinates?.[1] || 78.9629,
        type: signal.type,
        severity: signal.severity as 'low' | 'medium' | 'high',
        location: signal.location,
        timestamp: signal.created_at
      }))
    : [{
        id: eventData.id,
        lat: eventData.coordinates?.[0] || 20.5937,
        lng: eventData.coordinates?.[1] || 78.9629,
        type: eventData.event_type,
        severity: eventData.severity as 'low' | 'medium' | 'high',
        location: eventData.location,
        timestamp: eventData.created_at
      }];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Event Detail</h1>
                <p className="text-gray-600">
                  Event #{eventData.id} • {new Date(eventData.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Event Overview */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(eventData.severity)}`}>
                  {eventData.severity.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(eventData.status)}`}>
                  {eventData.status.toUpperCase()}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{eventData.title}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm">{eventData.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">{new Date(eventData.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">{eventData.signal_count} signals</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">{eventData.affected_population?.toLocaleString() || 'N/A'} affected</span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{eventData.description}</p>
            </div>
            
            {/* Key Metrics */}
            <div className="lg:w-80 space-y-4">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-800">Anomaly Score</span>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-900">
                  {eventData.anomaly_score ? (eventData.anomaly_score * 100).toFixed(0) : '87'}%
                </div>
                <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${eventData.anomaly_score ? eventData.anomaly_score * 100 : 87}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Confidence Level</span>
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-900">
                  {eventData.confidence ? (eventData.confidence * 100).toFixed(0) : '92'}%
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${eventData.confidence ? eventData.confidence * 100 : 92}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Map Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Signal Trend Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Signal Trend Analysis</span>
            </h3>
            {eventData.signalTrend ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={eventData.signalTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="signals" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                    name="Signals"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="anomaly" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Anomaly Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>Signal trend data not available</p>
              </div>
            )}
          </div>

          {/* Location Map */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <span>Event Location</span>
            </h3>
            <div style={{ height: '300px' }}>
              <MapComponent 
                signals={mapSignals}
                height="300px"
                center={eventData.coordinates as [number, number] || [20.5937, 78.9629]}
                zoom={12}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Location:</strong> {eventData.location}</p>
              {eventData.coordinates && (
                <p><strong>Coordinates:</strong> {eventData.coordinates[0]}, {eventData.coordinates[1]}</p>
              )}
              <p><strong>Related Signals:</strong> {relatedSignals.length}</p>
            </div>
          </div>
        </div>

        {/* Severity Distribution and Timeline */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Severity Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Signal Severity Distribution</h3>
            {eventData.severityDistribution ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={eventData.severityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="severity" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                <p>Severity distribution data not available</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Event Timeline</span>
            </h3>
            <div className="space-y-4">
              {eventData.timeline ? eventData.timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    item.severity === 'high' ? 'bg-red-500' :
                    item.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{item.event}</p>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Timeline data not available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations and Precautions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recommendations */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Recommended Actions</span>
            </h3>
            <ul className="space-y-3">
              {eventData.recommendations ? eventData.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{rec}</span>
                </li>
              )) : (
                <li className="text-gray-500">No specific recommendations available</li>
              )}
            </ul>
          </div>

          {/* Precautions */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Current Precautions</span>
            </h3>
            <ul className="space-y-3">
              {eventData.precautions ? eventData.precautions.map((precaution, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{precaution}</span>
                </li>
              )) : (
                <li className="text-gray-500">No specific precautions listed</li>
              )}
            </ul>
          </div>
        </div>

        {/* Related Information */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Data Sources</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Database signals ({relatedSignals.length})</li>
                <li>• Real-time monitoring</li>
                <li>• Community reports</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Health Authorities</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Local health department</li>
                <li>• Regional monitoring center</li>
                <li>• Emergency response team</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Continue monitoring</li>
                <li>• Update stakeholders</li>
                <li>• Review response measures</li>
              </ul>
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
                <p className="text-sm text-gray-700">I can help explain this event in detail. What would you like to know?</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                "Explain the anomaly score"
              </button>
              <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                "What should I do in this area?"
              </button>
              <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                "How serious is this event?"
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;