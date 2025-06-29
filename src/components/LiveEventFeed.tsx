import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, Filter, AlertTriangle, TrendingUp } from 'lucide-react';
import { getEvents, getSignals } from '../lib/supabase';
import EventCard from './EventCard';

const LiveEventFeed = () => {
  const [events, setEvents] = useState([]);
  const [recentSignals, setRecentSignals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadData();
    
    // Set up auto-refresh every 30 seconds
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadData, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      const [eventsResult, signalsResult] = await Promise.all([
        getEvents(),
        getSignals()
      ]);
      
      if (eventsResult.data) {
        setEvents(eventsResult.data);
      }
      
      if (signalsResult.data) {
        // Get only recent signals (last 6 hours)
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
        const recent = signalsResult.data.filter(signal => 
          new Date(signal.created_at) > sixHoursAgo
        );
        setRecentSignals(recent);
      }
    } catch (error) {
      console.error('Error loading live data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'active') return event.status === 'active';
    if (filter === 'high') return event.severity === 'high';
    return event.severity === filter;
  });

  const getSignalsByLocation = () => {
    const locationCounts = {};
    recentSignals.forEach(signal => {
      const location = signal.location.split(',')[0]; // Get city name
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    return Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading live events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Live Event Feed</h2>
              <p className="text-gray-600 text-sm">Real-time health events and signal clusters</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              <option value="active">Active Only</option>
              <option value="high">High Severity</option>
              <option value="medium">Medium Severity</option>
              <option value="low">Low Severity</option>
            </select>
            
            <button
              onClick={loadData}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Events</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{recentSignals.length}</div>
              <div className="text-sm text-gray-600">Signals (6h)</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.severity === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Severity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Signal Activity */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Signal Activity</h3>
        {getSignalsByLocation().length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {getSignalsByLocation().map(([location, count], index) => (
              <div key={location} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-600">{location}</div>
                <div className="text-xs text-gray-500">signals (6h)</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent signal activity</p>
        )}
      </div>

      {/* Events Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            {filter === 'all' ? 'All Events' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Events`}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredEvents.length} found)
            </span>
          </h3>
        </div>
        
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-lg text-center">
            <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No events have been detected yet. The system is monitoring for health signals.'
                : `No ${filter} events found. Try adjusting your filter.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveEventFeed;