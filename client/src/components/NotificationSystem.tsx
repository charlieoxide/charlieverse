import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'project_update' | 'user_action' | 'admin_action' | 'system_alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

const NotificationSystem: React.FC = () => {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      const newSocket = io();
      
      newSocket.on('connect', () => {
        console.log('Connected to WebSocket');
        newSocket.emit('authenticate', currentUser.id.toString());
        
        if (currentUser.role === 'admin') {
          newSocket.emit('join_admin_room');
        }
      });

      newSocket.on('notification', (notification: any) => {
        const newNotification: Notification = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          ...notification,
          timestamp: new Date(notification.timestamp),
          read: false
        };

        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico'
          });
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [currentUser]);

  useEffect(() => {
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project_update':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'user_action':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'admin_action':
        return <AlertCircle className="w-5 h-5 text-purple-500" />;
      case 'system_alert':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                          title="Mark as read"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setNotifications([])}
                className="w-full text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;