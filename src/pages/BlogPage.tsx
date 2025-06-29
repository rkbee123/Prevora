import React, { useState, useEffect } from 'react';
import { Search, MapPin, TrendingUp, Clock, AlertTriangle, Filter, Calendar, Tag, RefreshCw } from 'lucide-react';
import { getBlogs } from '../lib/supabase';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const { data } = await getBlogs();
      if (data) {
        setBlogPosts(data);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityFromTitle = (title: string) => {
    if (title.includes('URGENT')) return 'high';
    if (title.includes('Alert')) return 'medium';
    return 'low';
  };

  const getLocationFromTitle = (title: string) => {
    const match = title.match(/in\s+([^,\n]+)/i);
    return match ? match[1] : 'Unknown Location';
  };

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

  const getTypeIcon = (title: string) => {
    if (title.toLowerCase().includes('cough')) return <AlertTriangle className="h-5 w-5" />;
    if (title.toLowerCase().includes('wastewater')) return <MapPin className="h-5 w-5" />;
    if (title.toLowerCase().includes('pharmacy')) return <TrendingUp className="h-5 w-5" />;
    if (title.toLowerCase().includes('environmental')) return <Filter className="h-5 w-5" />;
    return <Tag className="h-5 w-5" />;
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const severity = getSeverityFromTitle(post.title);
    const matchesFilter = selectedFilter === 'all' || severity === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { value: 'all', label: 'All Posts' },
    { value: 'high', label: 'Urgent Alerts' },
    { value: 'medium', label: 'Health Alerts' },
    { value: 'low', label: 'Health Notices' }
  ];

  const formatContent = (content: string) => {
    // Extract first paragraph or summary
    const lines = content.split('\n').filter(line => line.trim());
    const firstParagraph = lines.find(line => 
      !line.startsWith('#') && 
      !line.startsWith('|') && 
      !line.startsWith('-') && 
      !line.startsWith('*') &&
      line.length > 50
    );
    return firstParagraph || content.substring(0, 200) + '...';
  };

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
              Real-time analysis of health signals, alerts, and prevention tips. Our AI system explains what the data means, 
              how to stay safe, and shares verified updates from health authorities.
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search health alerts and insights..."
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
                <button
                  onClick={loadBlogs}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading health insights...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Latest Health Insights ({filteredPosts.length})
                  </h2>
                  {blogPosts.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Last updated: {new Date(blogPosts[0]?.published_at).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredPosts.map((post) => {
                    const severity = getSeverityFromTitle(post.title);
                    const location = getLocationFromTitle(post.title);
                    
                    return (
                      <article key={post.id} className={`${getSeverityBg(severity)} rounded-2xl p-8 border-2 hover:shadow-xl transition-all duration-300 group cursor-pointer`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-gray-600" />
                            <span className="font-semibold text-gray-900">{location}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getSeverityColor(severity)} text-white text-xs font-semibold uppercase`}>
                            {severity === 'high' ? 'URGENT' : severity === 'medium' ? 'ALERT' : 'NOTICE'}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            {getTypeIcon(post.title)}
                          </div>
                          <span className="text-sm font-medium text-gray-600">AI Generated Alert</span>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {formatContent(post.content)}
                        </p>

                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-500">
                                {new Date(post.published_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-gray-500 text-sm">
                              By {post.author}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-gray-500 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(post.published_at).toLocaleTimeString()}</span>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Read Full Alert
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {filteredPosts.length === 0 && !isLoading && (
                  <div className="text-center py-16">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                    <p className="text-gray-600">
                      {blogPosts.length === 0 
                        ? 'No health alerts have been generated yet. The system is monitoring for signals.'
                        : 'Try adjusting your search terms or filters.'
                      }
                    </p>
                  </div>
                )}
              </>
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
                  Our AI-generated alerts are early indicators based on signal patterns. They suggest trends worth monitoring, not medical diagnoses.
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
                  <li>• Monitor local health updates</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <Calendar className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Stay Updated</h3>
                <p className="text-gray-600 mb-4">
                  Get real-time alerts and insights delivered when new signals are detected in your area.
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
          <h2 className="text-4xl font-bold mb-6">Help us detect signals faster</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our network of contributors and help build a comprehensive early warning system for your community.
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