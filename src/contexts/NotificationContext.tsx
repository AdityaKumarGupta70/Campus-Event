import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface Notification {
  id: string;
  type: 'assignment' | 'approval' | 'rejection';
  title: string;
  message: string;
  eventId: string;
  eventTitle: string;
  fromUser: {
    id: string;
    name: string;
    role: string;
  };
  toUser: {
    id: string;
    name: string;
    role: string;
  };
  timestamp: Date;
  status: 'unread' | 'read';
  actionRequired?: boolean;
  remarks?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'status'>) => void;
  markAsRead: (notificationId: string) => void;
  clearNotification: (notificationId: string) => void;
  getUnreadCount: () => number;
  getNotificationsForUser: (userId: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'status'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      status: 'unread',
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast for new notifications
    toast({
      title: notification.title,
      description: notification.message,
      duration: 5000,
    });
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, status: 'read' }
          : notif
      )
    );
  };

  const clearNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => notif.status === 'unread').length;
  };

  const getNotificationsForUser = (userId: string) => {
    return notifications.filter(notif => notif.toUser.id === userId);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        clearNotification,
        getUnreadCount,
        getNotificationsForUser,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};