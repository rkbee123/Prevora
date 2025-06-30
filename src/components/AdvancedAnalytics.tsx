import React from 'react';
import { BarChart3, TrendingUp, Activity, AlertTriangle, Users, Clock, MapPin, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdvancedAnalytics = () => {
  // Sample data for charts
  const signalTrendData = [
    { time: '00:00', signals: 12, anomaly: 0.2 },
    { time: '04:00', signals: 8, anomaly: 0.1 },
    { time: '08:00', signals: 25, anomaly: 0.4 },
    { time: '12:00', signals: 45, anomaly: 0.7 },
    { time: '16:00', signals: 38, anomaly: 0.6 },
    { time: '20:00', signals: 28, anomaly: 0.5 },
  ];

  const severityData = [
    { name: 'High', value: 15, color: '#ef4444' },
    { name: 'Medium', value: 35, color: '#f59e0b' },
    { name: 'Low', value: 50, color: '#10b981' },
  ];

  const locationData = [
    { location: 'Mumbai', signals: 45, events: 3 },
    { location: 'Delhi', signals: 32, events: 2 },
    { location: 'Bangalore', signals: 28, events: 1 },
    { location: 'Chennai', signals: 22, events: 1 },
    { location: 'Kolkata', signals: 18, events: 1 },
  ];

  const typeData = [
    { type: 'Cough', count: 45 },
    { type: 'Fever', count: 32 },
    { type: 'Respiratory', count: 28 },
    { type: 'Environmental', count: 15 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
        </div>
        <p className="text-gray-600">Comprehensive analysis of health signals and outbreak patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">1,247</h3>
          <p className="text-gray-600 text-sm">Total Signals (7d)</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-sm text-red-600 font-medium">+3</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">8</h3>
          <p className="text-gray-600 text-sm">Active Events</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">87%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">92%</h3>
          <p className="text-gray-600 text-sm">Detection Accuracy</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">-2h</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">14h</h3>
          <p className="text-gray-600 text-sm">Avg Detection Time</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Signal Trend */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Signal Trend (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={signalTrendData}>
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
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Location Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Signals by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="signals" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Signal Types */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Signal Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="type" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Top Locations */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Affected Locations</h3>
          <div className="space-y-4">
            {locationData.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">{location.location}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{location.signals}</div>
                  <div className="text-sm text-gray-500">{location.events} events</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Detection Speed</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Accuracy Rate</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="text-sm font-medium">92%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">False Positive Rate</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '8%' }}></div>
                </div>
                <span className="text-sm font-medium">8%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">System Uptime</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '99%' }}></div>
                </div>
                <span className="text-sm font-medium">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Key Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Peak Activity Hours</h4>
            <p className="text-gray-600 text-sm">Signal activity peaks between 12:00-16:00, suggesting higher transmission during midday hours.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Geographic Patterns</h4>
            <p className="text-gray-600 text-sm">Urban centers show 3x higher signal density compared to rural areas, indicating population density correlation.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Seasonal Trends</h4>
            <p className="text-gray-600 text-sm">Respiratory signals increase by 40% during winter months, aligning with seasonal illness patterns.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Early Detection Impact</h4>
            <p className="text-gray-600 text-sm">Average 14-hour lead time before traditional detection methods, enabling proactive response measures.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;