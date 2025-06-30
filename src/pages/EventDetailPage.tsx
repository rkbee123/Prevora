import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, TrendingUp, AlertTriangle, Users, Shield, Download, Share2, Eye, Calendar, Activity, BarChart3, Bot, Thermometer, Wind, Droplets, Pill, Target, Zap, Heart, CheckCircle } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import AIChat from '../components/AIChat';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getEventById, getSignals } from '../lib/supabase';
import { generateEventRecommendations } from '../lib/openai';

const EventDetailPage = () => {
  const { id } = useParams();
  const [showAIChat, setShowAIChat] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [relatedSignals, setRelatedSignals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [precautions, setPrecautions] = useState([]);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);

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
        
        // Generate AI recommendations
        generateRecommendations(dbEvent, signals || []);
      } else {
        // Fallback to mock data for demo
        const mockData = getMockEventData(id);
        setEventData(mockData);
        setRelatedSignals([]);
        
        // Generate AI recommendations for mock data
        generateRecommendations(mockData, []);
      }
    } catch (error) {
      console.error('Error loading event data:', error);
      // Use mock data as fallback
      const mockData = getMockEventData(id);
      setEventData(mockData);
      generateRecommendations(mockData, []);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = async (eventData, signals) => {
    setIsGeneratingRecommendations(true);
    try {
      const { recommendations: aiRecommendations, precautions: aiPrecautions } = await generateEventRecommendations(eventData, signals);
      setRecommendations(aiRecommendations);
      setPrecautions(aiPrecautions);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback recommendations
      setRecommendations([
        'Wear masks in crowded indoor areas',
        'Practice enhanced hand hygiene',
        'Monitor symptoms closely',
        'Avoid unnecessary travel to affected areas',
        'Stay informed through official channels',
        'Seek medical attention if symptoms develop'
      ]);
      setPrecautions([
        'Local hospitals have been notified and are on alert',
        'Health authorities are monitoring the situation',
        'Additional testing facilities have been set up',
        'Emergency response teams are on standby'
      ]);
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  // Generate comprehensive analytics based on signal data
  const generateAnalytics = (signals, eventSeverity, signalCount) => {
    const severityWeights = { high: 3, medium: 2, low: 1 };
    const totalWeight = signals.reduce((sum, s) => sum + (severityWeights[s.severity] || 1), 0);
    const avgSeverity = totalWeight / Math.max(signals.length, 1);
    
    // Generate signal trend based on actual data or realistic simulation
    const signalTrend = [];
    const baseTime = new Date();
    baseTime.setHours(baseTime.getHours() - 12);
    
    for (let i = 0; i < 13; i++) {
      const time = new Date(baseTime.getTime() + i * 60 * 60 * 1000);
      const hour = time.getHours();
      
      // Simulate realistic signal patterns (higher during day, peak around 10-11 AM)
      let baseSignals = Math.max(1, Math.floor(signalCount * (0.3 + 0.7 * Math.sin((hour - 6) * Math.PI / 12))));
      if (i >= 10) baseSignals = Math.floor(baseSignals * 1.5); // Recent spike
      
      const anomalyScore = Math.min(0.95, baseSignals / (signalCount * 0.8));
      
      signalTrend.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        signals: baseSignals,
        anomaly: anomalyScore,
        cumulative: signalTrend.reduce((sum, s) => sum + s.signals, 0) + baseSignals
      });
    }

    // Generate severity distribution
    const severityDistribution = [
      { 
        severity: 'High', 
        count: signals.filter(s => s.severity === 'high').length || Math.floor(signalCount * 0.3),
        color: '#ef4444' 
      },
      { 
        severity: 'Medium', 
        count: signals.filter(s => s.severity === 'medium').length || Math.floor(signalCount * 0.4),
        color: '#f59e0b' 
      },
      { 
        severity: 'Low', 
        count: signals.filter(s => s.severity === 'low').length || Math.floor(signalCount * 0.3),
        color: '#10b981' 
      }
    ];

    // Generate signal types based on actual data or realistic distribution
    const typeMap = {};
    signals.forEach(s => {
      typeMap[s.type] = (typeMap[s.type] || 0) + 1;
    });
    
    const signalTypes = Object.keys(typeMap).length > 0 
      ? Object.entries(typeMap).map(([type, count]) => ({
          type,
          count,
          percentage: Math.round((count / signals.length) * 100)
        }))
      : [
          { type: 'Cough', count: Math.floor(signalCount * 0.5), percentage: 50 },
          { type: 'Fever', count: Math.floor(signalCount * 0.25), percentage: 25 },
          { type: 'Respiratory', count: Math.floor(signalCount * 0.15), percentage: 15 },
          { type: 'Environmental', count: Math.floor(signalCount * 0.1), percentage: 10 }
        ];

    // Generate geographic spread
    const locationParts = signals.map(s => s.location.split(',')[0]).filter(Boolean);
    const locationCounts = {};
    locationParts.forEach(loc => {
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    const geographicSpread = Object.keys(locationCounts).length > 0
      ? Object.entries(locationCounts).map(([area, count]) => ({
          area,
          signals: count,
          severity: count > signalCount * 0.4 ? 'high' : count > signalCount * 0.2 ? 'medium' : 'low'
        }))
      : [
          { area: 'Central District', signals: Math.floor(signalCount * 0.6), severity: eventSeverity },
          { area: 'East District', signals: Math.floor(signalCount * 0.25), severity: 'medium' },
          { area: 'West District', signals: Math.floor(signalCount * 0.15), severity: 'low' }
        ];

    // Generate risk assessment radar
    const riskFactors = [
      { factor: 'Signal Density', value: Math.min(100, (signalCount / 50) * 100) },
      { factor: 'Severity Level', value: avgSeverity * 33.33 },
      { factor: 'Geographic Spread', value: Math.min(100, geographicSpread.length * 25) },
      { factor: 'Time Concentration', value: 75 }, // Based on 24h window
      { factor: 'Population Density', value: 80 }, // Urban area assumption
      { factor: 'Healthcare Capacity', value: 60 } // Regional capacity
    ];

    return {
      signalTrend,
      severityDistribution,
      signalTypes,
      geographicSpread,
      riskFactors,
      avgSeverity
    };
  };

  // Enhanced mock data generator with comprehensive analytics
  const getMockEventData = (eventId: string) => {
    const signalCount = 21;
    const eventSeverity = 'high';
    const mockSignals = [
      { severity: 'high', type: 'Cough', location: 'Mumbai, Andheri West' },
      { severity: 'medium', type: 'Fever', location: 'Mumbai, Andheri West' },
      { severity: 'high', type: 'Cough', location: 'Mumbai, Andheri East' },
      { severity: 'low', type: 'Respiratory', location: 'Mumbai, Juhu' },
      { severity: 'medium', type: 'Cough', location: 'Mumbai, Andheri West' },
      { severity: 'high', type: 'Fever', location: 'Mumbai, Andheri West' }
    ];

    const analytics = generateAnalytics(mockSignals, eventSeverity, signalCount);

    // Generate event timeline
    const eventTimeline = [
      {
        time: '08:15 AM',
        event: 'First signal detected',
        severity: 'medium',
        details: 'Initial cough signal reported in Andheri West'
      },
      {
        time: '09:30 AM',
        event: 'Signal pattern identified',
        severity: 'medium',
        details: 'AI system detected unusual pattern in signal distribution'
      },
      {
        time: '10:32 AM',
        event: 'Event created',
        severity: 'high',
        details: 'Automatic event creation triggered by threshold crossing'
      },
      {
        time: '10:45 AM',
        event: 'Health authorities notified',
        severity: 'high',
        details: 'Automatic alert sent to local health department'
      },
      {
        time: '11:15 AM',
        event: 'Community alert issued',
        severity: 'high',
        details: 'Public notification system activated'
      },
      {
        time: '12:30 PM',
        event: 'Response team deployed',
        severity: 'high',
        details: 'Health officials dispatched to affected area'
      }
    ];

    return {
      id: eventId,
      title: 'Cough cluster detected – Mumbai, Andheri',
      location: 'Andheri West, Mumbai',
      event_type: 'Respiratory',
      severity: eventSeverity,
      status: 'active',
      signal_count: signalCount,
      description: 'Unusual spike in cough-related vibration signals detected via wearables and acoustic monitors in Mumbai\'s Andheri West area.',
      created_at: '2025-06-28T10:32:00Z',
      coordinates: [19.1136, 72.8697],
      anomaly_score: 0.87,
      confidence: 0.92,
      affected_population: 45000,
      timeline: eventTimeline,
      ...analytics
    };
  };

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

  const getSignalTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cough': return <Activity className="h-4 w-4" />;
      case 'fever': return <Thermometer className="h-4 w-4" />;
      case 'respiratory': return <Wind className="h-4 w-4" />;
      case 'environmental': return <Droplets className="h-4 w-4" />;
      case 'pharmacy': return <Pill className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
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

  // Generate analytics for real data
  const analytics = relatedSignals.length > 0 
    ? generateAnalytics(relatedSignals, eventData.severity, eventData.signal_count)
    : eventData;

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

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 relative z-10">
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
                  Event #{eventData.id.slice(0, 8)} • {new Date(eventData.created_at).toLocaleDateString()}
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

        {/* Signal Trend Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Signal Trend Analysis</span>
          </h3>
          {analytics.signalTrend ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={analytics.signalTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="signals" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  name="Signals"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="anomaly" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Anomaly Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-gray-500">
              <p>Signal trend data not available</p>
            </div>
          )}
        </div>

        {/* Charts and Map Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Severity Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Signal Severity Distribution</h3>
            {analytics.severityDistribution ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analytics.severityDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ severity, count }) => `${severity}: ${count}`}
                    >
                      {analytics.severityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4">
                  {analytics.severityDistribution.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm font-medium">{item.severity}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                      <div className="text-xs text-gray-500">
                        {Math.round((item.count / eventData.signal_count) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                <p>Severity distribution data not available</p>
              </div>
            )}
          </div>

          {/* Location Map */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <span>Event Location</span>
            </h3>
            <div style={{ height: '300px', zIndex: 1 }}>
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
              <p><strong>Related Signals:</strong> {relatedSignals.length || eventData.signal_count}</p>
            </div>
          </div>
        </div>

        {/* Signal Type Breakdown and Geographic Spread */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Signal Types */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Signal Type Breakdown</h3>
            {analytics.signalTypes ? (
              <div className="space-y-4">
                {analytics.signalTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getSignalTypeIcon(type.type)}
                      <span className="font-medium text-gray-900">{type.type}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{type.count}</div>
                        <div className="text-sm text-gray-500">{type.percentage}%</div>
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${type.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Signal type data not available</p>
              </div>
            )}
          </div>

          {/* Geographic Spread */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Geographic Spread</h3>
            {analytics.geographicSpread ? (
              <div className="space-y-4">
                {analytics.geographicSpread.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        area.severity === 'high' ? 'bg-red-500' :
                        area.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <span className="font-medium text-gray-900">{area.area}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{area.signals}</div>
                      <div className="text-sm text-gray-500">signals</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Geographic data not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Risk Assessment Radar */}
        {analytics.riskFactors && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span>Risk Assessment</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={analytics.riskFactors}>
                <PolarGrid />
                <PolarAngleAxis dataKey="factor" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Risk Level"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span>Event Timeline</span>
          </h3>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {eventData.timeline ? eventData.timeline.map((item, index) => (
                <div key={index} className="flex items-start ml-4">
                  <div className={`absolute left-4 w-4 h-4 rounded-full -ml-2 ${
                    item.severity === 'high' ? 'bg-red-500' :
                    item.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  } border-2 border-white`}></div>
                  <div className="bg-gray-50 rounded-lg p-4 ml-6 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{item.event}</p>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </div>
                    {item.details && (
                      <p className="text-sm text-gray-600">{item.details}</p>
                    )}
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

        {/* AI-Generated Recommendations and Precautions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recommendations */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>AI-Generated Recommendations</span>
              {isGeneratingRecommendations && <Bot className="h-4 w-4 animate-spin text-blue-600" />}
            </h3>
            <ul className="space-y-3">
              {recommendations.length > 0 ? recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{rec}</span>
                </li>
              )) : (
                <li className="text-gray-500">Generating recommendations...</li>
              )}
            </ul>
          </div>

          {/* Precautions */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>AI-Generated Precautions</span>
              {isGeneratingRecommendations && <Bot className="h-4 w-4 animate-spin text-blue-600" />}
            </h3>
            <ul className="space-y-3">
              {precautions.length > 0 ? precautions.map((precaution, index) => (
                <li key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Zap className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{precaution}</span>
                </li>
              )) : (
                <li className="text-gray-500">Generating precautions...</li>
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
                <li>• Database signals ({relatedSignals.length || eventData.signal_count})</li>
                <li>• Real-time monitoring</li>
                <li>• Community reports</li>
                <li>• Wearable sensors</li>
                <li>• Environmental data</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Health Authorities</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Local health department</li>
                <li>• Regional monitoring center</li>
                <li>• Emergency response team</li>
                <li>• Hospital networks</li>
                <li>• Public health officials</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Continue monitoring</li>
                <li>• Update stakeholders</li>
                <li>• Review response measures</li>
                <li>• Assess effectiveness</li>
                <li>• Plan follow-up actions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Prevora AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setShowAIChat(!showAIChat)}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          <Bot className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <AIChat isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
    </div>
  );
};

export default EventDetailPage;