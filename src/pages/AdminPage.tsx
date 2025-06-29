import React, { useState, useEffect } from 'react';
import { Shield, Users, AlertTriangle, BarChart3, Settings, Plus, Edit, Trash2, Eye, Download, Upload, Search, Filter, Calendar, MapPin, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import AddSignalForm from '../components/AddSignalForm';
import { getSignals, getSignalCount, getEvents, getAlerts } from '../lib/supabase';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [signals, setSignals] = useState([]);
  const [signalCount, setSignalCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'signals', name: 'Signals', icon: Activity },
    { id: 'alerts', name: 'Alerts', icon: AlertTriangle },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load signals
      const { data: signalsData } = await getSignals();
      if (signalsData) setSignals(signalsData);

      // Load signal count
      const { count } = await getSignalCount();
      if (count !== null) setSignalCount(count);

      // Load events
      const { data: eventsData } = await getEvents();
      if (eventsData) setEvents(eventsData);

      // Load alerts
      const { data: alertsData } = await getAlerts();
      if (alertsData) setAlerts(alertsData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignalAdded = () => {
    // Refresh data when a new signal is added
    loadDashboardData();
  };

  const dashboardStats = [
    { 
      title: 'Total Signals Today', 
      value: signalCount.toString(), 
      change: '+12%', 
      color: 'blue',
      description: 'Signals in database'
    },
    { 
      title: 'Active Events', 
      value: events.filter(e => e.status === 'active').length.toString(), 
      change: '+2', 
      color: 'green',
      description: 'Currently active events'
    },
    { 
      title: 'Alerts Issued', 
      value: alerts.filter(a => a.status === 'active').length.toString(), 
      change: '0', 
      color: 'yellow',
      description: 'Active alerts'
    },
    { 
      title: 'High Severity', 
      value: signals.filter(s => s.severity === 'high').length.toString(), 
      change: '+4', 
      color: 'red',
      description: 'High severity signals'
    },
  ];

  const recentAlerts = alerts.slice(0, 5).map(alert => ({
    id: alert.id,
    title: alert.title,
    severity: alert.severity,
    status: alert.status,
    location: alert.location,
    created: new Date(alert.issued_at).toLocaleString(),
    signals: 0 // This would need to be calculated based on related signals
  }));

  const users = [
    { id: 1, name: 'Dr. Sarah Chen', email: 'sarah.chen@hospital.com', role: 'Admin', status: 'Active', joined: '2024-01-15' },
    { id: 2, name: 'Dr. Raj Patel', email: 'raj.patel@health.gov', role: 'User', status: 'Active', joined: '2024-02-20' },
    { id: 3, name: 'Dr. Maria Garcia', email: 'maria.garcia@clinic.org', role: 'User', status: 'Inactive', joined: '2024-03-10' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-600'}`}>
                  {stat.change} from yesterday
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <TrendingUp className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Signal Form */}
      <AddSignalForm onSignalAdded={handleSignalAdded} />

      {/* Charts and Map */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Signal Distribution Map</h3>
            <button 
              onClick={loadDashboardData}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <MapComponent 
            height="300px"
            center={[20.5937, 78.9629]}
            zoom={5}
            signals={signals.map(signal => ({
              id: signal.id,
              lat: typeof signal.latitude === 'number' && !isNaN(signal.latitude) ? signal.latitude : 20.5937,
              lng: typeof signal.longitude === 'number' && !isNaN(signal.longitude) ? signal.longitude : 78.9629,
              type: signal.type,
              severity: signal.severity as 'low' | 'medium' | 'high',
              location: signal.location,
              timestamp: signal.created_at
            }))}
          />
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentAlerts.length > 0 ? recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{alert.title}</h4>
                  <p className="text-sm text-gray-600">{alert.location} • {alert.created}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </span>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSignals = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Signal Management</h2>
        <div className="flex items-center space-x-3">
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Add Signal Form */}
      <AddSignalForm onSignalAdded={handleSignalAdded} />

      {/* Signals Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search signals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Types</option>
              <option>Cough</option>
              <option>Fever</option>
              <option>Respiratory</option>
              <option>Wastewater</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signal ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {signals.filter(signal => 
                signal.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                signal.type.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((signal) => (
                <tr key={signal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {signal.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{signal.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{signal.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(signal.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(signal.severity)}`}>
                      {signal.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {signals.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No signals found</h3>
              <p className="text-gray-500">Add your first signal using the form above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Alert Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Alert</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{alert.title}</div>
                      <div className="text-sm text-gray-500">{alert.id.slice(0, 8)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alert.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(alert.issued_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.joined}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Alert Thresholds</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">High Severity Threshold</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" defaultValue="20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medium Severity Threshold</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" defaultValue="10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Low Severity Threshold</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" defaultValue="5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Email Notifications</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">SMS Alerts</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Push Notifications</span>
              <input type="checkbox" className="rounded" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Data Retention</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Signal Data Retention (days)</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" defaultValue="90" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alert Data Retention (days)</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" defaultValue="365" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Database Connection</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">AI Processing</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Alert System</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Operational</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading && signals.length === 0) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'signals': return renderSignals();
      case 'alerts': return renderAlerts();
      case 'users': return renderUsers();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage signals, alerts, users, and system settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;