import React, { useState } from 'react';
import { Search, MapPin, TrendingUp, Clock, AlertTriangle, Filter, Calendar, Tag } from 'lucide-react';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: 'Spike in cough signals detected in Mumbai — What it could mean & how to stay safe',
      location: 'Mumbai, Andheri West',
      type: 'Respiratory',
      severity: 'high',
      date: '2025-06-28',
      timeAgo: '2 hours ago',
      summary: 'Our system detected a 21% rise in cough-related vibration signals reported by wearables and acoustic monitors in Mumbai\'s Andheri West and Bandra areas over the past 48 hours.',
      trend: '+21%',
      signals: 47,
      image: 'https://images.pexels.com/photos/3902882/pexels-photo-3902882.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 2,
      title: 'Wastewater viral traces show uptick in Delhi Central District',
      location: 'Delhi, Central District',
      type: 'Wastewater',
      severity: 'medium',
      date: '2025-06-27',
      timeAgo: '1 day ago',
      summary: 'Community-level wastewater sampling indicates a moderate increase in viral load, suggesting potential early-stage community transmission.',
      trend: '+15%',
      signals: 23,
      image: 'https://images.pexels.com/photos/3844581/pexels-photo-3844581.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 3,
      title: 'Pharmacy trend analysis reveals fever medication surge in Bangalore',
      location: 'Bangalore, Tech Corridor',
      type: 'Pharmacy',
      severity: 'low',
      date: '2025-06-26',
      timeAgo: '2 days ago',
      summary: 'Aggregated pharmacy data shows a 12% increase in fever and cold medication purchases across major pharmacy chains in the tech corridor area.',
      trend: '+12%',
      signals: 34,
      image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 4,
      title: 'Multi-signal cluster detected in Chennai: Air quality and respiratory patterns',
      location: 'Chennai, T. Nagar',
      type: 'Environmental',
      severity: 'medium',
      date: '2025-06-25',
      timeAgo: '3 days ago',
      summary: 'Combined environmental and health signals indicate a correlation between air quality deterioration and increased respiratory symptoms.',
      trend: '+18%',
      signals: 52,
      image: 'https://images.pexels.com/photos/3902882/pexels-photo-3902882.jpeg?auto=compress&cs=tinysrgb&w=600'
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Respiratory': return <AlertTriangle className="h-5 w-5" />;
      case 'Wastewater': return <MapPin className="h-5 w-5" />;
      case 'Pharmacy': return <TrendingUp className="h-5 w-5" />;
      case 'Environmental': return <Filter className="h-5 w-5" />;
      default: return <Tag className="h-5 w-5" />;
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || post.type.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { value: 'all', label: 'All Signals' },
    { value: 'respiratory', label: 'Respiratory' },
    { value: 'wastewater', label: 'Wastewater' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'environmental', label: 'Environmental' }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Live Health <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Insights</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Real-time analysis of health signals, alerts, and prevention tips. Our blog explains what the data means, 
              how to stay safe, and shares verified updates from health authorities.
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location or topic..."
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
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className={`${getSeverityBg(post.severity)} rounded-2xl p-8 border-2 hover:shadow-xl transition-all duration-300 group cursor-pointer`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">{post.location}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getSeverityColor(post.severity)} text-white text-xs font-semibold uppercase`}>
                      {post.severity}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {getTypeIcon(post.type)}
                    </div>
                    <span className="text-sm font-medium text-gray-600">{post.type} Signal</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {post.summary}
                  </p>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-lg text-gray-900">{post.trend}</span>
                      </div>
                      <div className="text-gray-500 text-sm">
                        {post.signals} signals detected
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{post.timeAgo}</span>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Read Full Analysis
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sidebar Info */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <AlertTriangle className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Understanding Alerts</h3>
                <p className="text-gray-600 mb-4">
                  Our signals are early indicators, not medical diagnoses. They suggest patterns worth monitoring.
                </p>
                <button className="text-blue-600 font-medium hover:text-blue-700">Learn more →</button>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Prevention Tips</h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Wear masks in crowded areas</li>
                  <li>• Practice good hand hygiene</li>
                  <li>• Stay home if symptomatic</li>
                  <li>• Ensure good ventilation</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <Calendar className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Stay Updated</h3>
                <p className="text-gray-600 mb-4">
                  Get alerts and insights delivered to your inbox when new signals are detected in your area.
                </p>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Subscribe to Alerts
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Want to help us detect signals faster?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our network of contributors and help build a comprehensive early warning system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Contribute Data
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Partner with Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;