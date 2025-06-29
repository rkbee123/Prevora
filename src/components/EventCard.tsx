import React from 'react';
import { MapPin, Clock, TrendingUp, AlertTriangle, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  location: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high';
  status: string;
  signal_count: number;
  description: string;
  created_at: string;
}

interface EventCardProps {
  event: Event;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className = '' }) => {
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

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const eventTime = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - eventTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className={`${getSeverityBg(event.severity)} rounded-xl p-6 border-2 hover:shadow-xl transition-all duration-300 group cursor-pointer ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-900 truncate">{event.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.severity)} flex-shrink-0`}></div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
            {event.status}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <AlertTriangle className="h-4 w-4 text-gray-600" />
        </div>
        <span className="text-sm font-medium text-gray-600">{event.event_type} Event</span>
      </div>

      <h3 className="font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
        {event.title}
      </h3>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {event.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{event.signal_count} signals</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500">{timeAgo(event.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Event #{event.id.slice(0, 8)}...</span>
        <Link
          to={`/event/${event.id}`}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          <span>View Details</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

export default EventCard;