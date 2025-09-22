import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

export const NotificationsDropdown: React.FC = () => {
  const { user } = useAuth();
  const {
    getNotificationsForUser,
    getUnreadCount,
    markAsRead,
    clearNotification,
  } = useNotifications();

  const notifications = user ? getNotificationsForUser(user.id) : [];
  const unreadCount = getUnreadCount();

  const formatTimestamp = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start p-4 ${
                notification.status === 'unread' ? 'bg-accent' : ''
              }`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{notification.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotification(notification.id);
                  }}
                  className="text-sm text-muted-foreground hover:text-destructive"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {notification.message}
              </p>
              {notification.remarks && (
                <p className="text-sm text-muted-foreground mt-1 italic">
                  "{notification.remarks}"
                </p>
              )}
              <div className="flex items-center justify-between w-full mt-2">
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(notification.timestamp)}
                </span>
                {notification.actionRequired && (
                  <Badge variant="outline" className="text-xs">
                    Action Required
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};