import React from 'react';
import { X, Bell, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'High Severity Event Detected',
      message: 'Cough cluster in Mumbai, Andheri West requires attention',
      timestamp: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'System Update',
      message: 'AI models have been updated with latest patterns',
      timestamp: '1 hour ago',
      read: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Event Resolved',
      message: 'Delhi wastewater alert has been resolved',
      timestamp: '3 hours ago',
      read: true
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mt-16 mr-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{notification.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;