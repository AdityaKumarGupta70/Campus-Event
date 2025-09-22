// Notification types for the Faculty Portal workflow

export interface NotificationUser {
  id: string;
  name: string;
  role: string;
}

export type NotificationType = 
  | 'assignment' 
  | 'approval' 
  | 'rejection' 
  | 'host-assignment'
  | 'form-handoff'
  | 'event-published';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  eventId: string;
  eventTitle: string;
  fromUser: NotificationUser;
  toUser: NotificationUser;
  timestamp: Date;
  status: 'unread' | 'read';
  actionRequired?: boolean;
  remarks?: string;
  metadata?: {
    // Additional context based on notification type
    hostAssignmentId?: string;
    approvalDeadline?: Date;
    formStep?: number;
    [key: string]: unknown;
  };
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'status'>) => void;
  markAsRead: (notificationId: string) => void;
  clearNotification: (notificationId: string) => void;
  getUnreadCount: () => number;
  getNotificationsForUser: (userId: string) => Notification[];
}