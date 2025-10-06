import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, CheckCircle, X, AlertCircle } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

interface StudentHostNotificationCardProps {
  notification: {
    id: string;
    type: 'host-assignment';
    title: string;
    message: string;
    eventId: string;
    eventTitle: string;
    fromUser: {
      id: string;
      name: string;
      role: string;
    };
    timestamp: Date;
    actionRequired?: boolean;
    metadata?: {
      hostAssignmentId?: string;
      approvalDeadline?: Date;
    };
  };
  onAccept?: () => void;
  onDecline?: () => void;
}

export const StudentHostNotificationCard: React.FC<StudentHostNotificationCardProps> = ({
  notification,
  onAccept,
  onDecline,
}) => {
  const [isResponding, setIsResponding] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const { addNotification, markAsRead } = useNotifications();
  const { user } = useAuth();

  const handleAccept = async () => {
    setIsResponding(true);
    try {
      // Mark the notification as read
      markAsRead(notification.id);
      
      // Send acceptance notification back to faculty
      addNotification({
        type: 'assignment',
        title: 'Host Assignment Accepted',
        message: `${user?.name} has accepted the role of host for "${notification.eventTitle}"`,
        eventId: notification.eventId,
        eventTitle: notification.eventTitle,
        fromUser: {
          id: user?.id || '',
          name: user?.name || '',
          role: user?.role || 'student',
        },
        toUser: notification.fromUser,
        actionRequired: true,
        metadata: {
          hostAssignmentId: notification.metadata?.hostAssignmentId,
          responseType: 'accepted',
        },
      });

      setHasResponded(true);
      onAccept?.();
    } catch (error) {
      console.error('Error accepting host assignment:', error);
    } finally {
      setIsResponding(false);
    }
  };

  const handleDecline = async () => {
    setIsResponding(true);
    try {
      // Mark the notification as read
      markAsRead(notification.id);
      
      // Send decline notification back to faculty
      addNotification({
        type: 'assignment',
        title: 'Host Assignment Declined',
        message: `${user?.name} has declined the role of host for "${notification.eventTitle}"`,
        eventId: notification.eventId,
        eventTitle: notification.eventTitle,
        fromUser: {
          id: user?.id || '',
          name: user?.name || '',
          role: user?.role || 'student',
        },
        toUser: notification.fromUser,
        actionRequired: true,
        metadata: {
          hostAssignmentId: notification.metadata?.hostAssignmentId,
          responseType: 'declined',
        },
      });

      setHasResponded(true);
      onDecline?.();
    } catch (error) {
      console.error('Error declining host assignment:', error);
    } finally {
      setIsResponding(false);
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60)),
      'hour'
    );
  };

  if (hasResponded) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Response Sent
          </CardTitle>
          <CardDescription>
            Your response has been sent to {notification.fromUser.name}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-orange-600" />
            <div>
              <CardTitle className="text-lg">{notification.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span>From: {notification.fromUser.name}</span>
                <Badge variant="outline" className="text-xs">
                  {notification.fromUser.role}
                </Badge>
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <Badge variant="default" className="bg-orange-600">
              Action Required
            </Badge>
            <span className="text-xs text-muted-foreground mt-1">
              {formatTimestamp(notification.timestamp)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-sm mb-2">Event Details</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{notification.eventTitle}</span>
          </div>
        </div>
        
        <div className="p-3 bg-white border rounded-md">
          <p className="text-sm">{notification.message}</p>
        </div>

        {notification.metadata?.approvalDeadline && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Please respond by {new Date(notification.metadata.approvalDeadline).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleAccept}
            disabled={isResponding}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isResponding ? 'Responding...' : 'Accept Host Role'}
          </Button>
          <Button
            onClick={handleDecline}
            disabled={isResponding}
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
          >
            {isResponding ? 'Responding...' : 'Decline'}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          As the event host, you'll be responsible for completing the event details form and coordinating with the assigned team members.
        </div>
      </CardContent>
    </Card>
  );
};