import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertTriangle, MapPin, Clock, Zap, Users, Shield, RefreshCw, Eye, Filter, Search } from 'lucide-react';
import { getSignals, getEvents, getAlerts } from '../lib/supabase';

const RealTimeMonitor = () => {
  const [signals, setSignals] = useState([]);
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
    
    // Set up auto-refresh every 10 seconds
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadData();
      }, 10000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      const [signalsResult, eventsResult, alertsResult] = await Promise.all([
        getSignals(),
        getEvents(),
        getAlerts()
      ]);
      
      if (signalsResult.data) {
        setSignals(signalsResult.data);
      }
      
      if (eventsResult.data) {
        setEvents(eventsResult.data);
      }
      
      if (alertsResult.data) {
        setAlerts(alertsResult.data);
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading real-time data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecentSignals = () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return signals.filter(signal => new Date(signal.created_at) > oneHourAgo);
  };

  const getActiveEvents = () => {
    return events.filter(event => event.status === 'active');
  };

  const getActiveAlerts = () => {
    return alerts.filter(alert => alert.status === 'active');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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
    switch (status.toLowerCase()) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSignals = getRecentSignals().filter(signal => {
    const matchesSearch = signal.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signal.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || signal.severity === filter;
    return matchesSearch && matchesFilter;
  });

  const recentSignals = getRecentSignals();
  const activeEvents = getActiveEvents();
  const activeAlerts = getActiveAlerts();

  const stats = [
    {
      title: 'Live Signals',
      value: recentSignals.length.toString(),
      subtitle: 'Last hour',
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'Active Events',
      value: activeEvents.length.toString(),
      subtitle: 'Monitoring',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Active Alerts',
      value: activeAlerts.length.toString(),
      subtitle: 'Issued',
      icon: Shield,
      color: 'orange'
    },
    {
      title: 'High Severity',
      value: recentSignals.filter(s => s.severity === 'high').length.toString(),
      subtitle: 'Urgent',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const signalTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - signalTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Real-Time Monitor</h2>
              <p className="text-gray-600 text-sm">Live health signal monitoring and event tracking</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
            </div>
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {autoRefresh ? 'Auto ON' : 'Auto OFF'}
            </button>
            
            <button
              onClick={loadData}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search signals by location or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Live Signal Feed */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Live Signal Feed</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading live data...</span>
          </div>
        ) : filteredSignals.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredSignals.map((signal) => (
              <div key={signal.id} className={`${getSeverityBg(signal.severity)} rounded-lg p-4 border-2 hover:shadow-md transition-all duration-200`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(signal.severity)}`}></div>
                      <span className="font-semibold text-gray-900">{signal.type} Signal</span>
                      <span className="text-sm text-gray-500">#{signal.id.slice(0, 8)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{signal.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{timeAgo(signal.created_at)}</span>
                      </div>
                    </div>
                    
                    {signal.notes && (
                      <p className="text-sm text-gray-600">{signal.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      signal.severity === 'high' ? 'bg-red-100 text-red-800' :
                      signal.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {signal.severity.toUpperCase()}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent signals</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'No signals match your current filters.'
                : 'No signals detected in the last hour. System is monitoring.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Active Events */}
      {activeEvents.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Active Events</h3>
          <div className="space-y-4">
            {activeEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{event.location}</span>
                    <span>{event.signal_count} signals</span>
                    <span>{timeAgo(event.created_at)}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.severity === 'high' ? 'bg-red-100 text-red-800' :
                  event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {event.severity.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Signal Processing</p>
              <p className="text-sm text-gray-600">Operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Event Detection</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Alert System</p>
              <p className="text-sm text-gray-600">Ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitor;